---
layout: post
title: "Postgres: Comparing UUID and BYTEA Primary Keys"
author: Michael Minter
date: 2026-09-30
description: "Comparing ULID storage as UUID and BYTEA in Postgres, with one million inserts, sampled reads, and a closer look at the UUIDv7 test."
comments: true
tags: [Postgres, SQL, UUID, ULID, benchmarks]
---

If you're using ULIDs as primary keys in __Postgres__, you have a few options for storing them. I put together a [benchmark](https://github.com/michaelminter/postgres-uuid-benchmark) to compare native UUID storage, raw bytes, and a table intended for UUIDv7.

The saved results show a difference in read performance. But there's a detail in the test code that changes what we can conclude about UUIDv7.

<!-- more -->

## Storage

A [ULID](https://github.com/ulid/spec) contains a 48-bit timestamp and 80 bits of randomness. That's 128 bits, or 16 bytes. Its familiar 26-character string is an encoding of that value.

Postgres also has a native [UUID type](https://www.postgresql.org/docs/18/datatype-uuid.html) for 128-bit identifiers. The benchmark takes the same ULID and supplies either its UUID representation or its raw bytes:

```python
ulid_obj = new_ulid()

ulid_uuid = ulid_obj.uuid
ulid_bytes = ulid_obj.bytes
```

Representing a ULID as a UUID preserves the value. __It doesn't turn it into UUIDv7.__

The two storage tests use these tables:

```sql
CREATE TABLE ulid_uuid_table (
    id         UUID PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ulid_bytea_table (
    id         BYTEA PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Both receive the same identifiers and names. The difference is how the primary key is represented and handled by Postgres and the Python driver.

TEXT and VARCHAR aren't part of this test. Neither are integer primary keys or UUIDv4, so these results don't rank those alternatives.

## Insert and Select Tests

The script generates __one million records__ in memory before timing the inserts. Each table is truncated before its test, then populated with `psycopg2`'s `executemany()` and committed once.

This measures the Python-to-Postgres insert path, including driver work and the commit. It isn't a measurement of Postgres alone. [Psycopg's documentation](https://www.psycopg.org/docs/cursor.html#cursor.executemany) also points out that `executemany()` doesn't provide the performance improvement of its fast execution helpers.

The insert connection uses `synchronous_commit = OFF`. That setting allows success to be reported before WAL is durably flushed, so a crash can lose recent acknowledged transactions. Keep that [durability setting](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) in mind when comparing these timings with your application.

For reads, the script samples __10,000 IDs__ from each table and retrieves the matching rows in one query:

```python
sql = "SELECT * FROM ulid_uuid_table WHERE id = ANY(%s::uuid[])"
cursor.execute(sql, (ids,))
rows = cursor.fetchall()
```

There are two warm-up runs followed by three timed runs. The script reports the mean and standard deviation. Sampling happens before timing; query execution and fetching the rows are timed together.

These are warm reads of a batch of records. The select duration isn't the latency of an individual lookup.

## Results

The [saved chart](https://github.com/michaelminter/postgres-uuid-benchmark/blob/main/public/Figure_1.png) records the following values, rounded here for readability. Its third test is labeled UUIDv7, but the current script inserts ULIDs into that table too.

| Test | Insert 1,000,000 rows | Select 10,000 rows |
| --- | ---: | ---: |
| ULID stored as UUID | 25.36 seconds | 48.3 milliseconds |
| ULID stored as BYTEA | 23.06 seconds | 96.5 milliseconds |
| Third UUID table, labeled UUIDv7 | 23.02 seconds | 37.7 milliseconds |

BYTEA's recorded read duration is about twice that of the first UUID table. Its insert duration is about 9% lower.

The third table has the lowest recorded times. However, the current insert code supplies the same ULID-derived UUID values used in the first table:

```python
table3_data = [(str(d['ulid_uuid_obj']), d['name']) for d in all_data]
insert_sql_3 = "INSERT INTO uuid7_table (id, name) VALUES (%s, %s)"
```

Supplying `id` explicitly bypasses the table's [default value](https://www.postgresql.org/docs/18/ddl-default.html). The custom `uuid_v7()` default isn't exercised by this insert.

That means the saved UUIDv7 label can't establish a performance advantage for UUIDv7. The difference between the two UUID tables also gives me a reason to repeat the complete benchmark before treating the storage results as settled. The saved output doesn't document the hardware, server version, or query plans needed to explain that difference.

## Check the Query Plan

The script runs `ANALYZE` before the insert tests and again after loading the records. [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html) updates the statistics used by the query planner.

```sql
ANALYZE ulid_uuid_table;
ANALYZE ulid_bytea_table;
ANALYZE uuid7_table;
```

Updated statistics help, but they don't guarantee an index scan. Use [EXPLAIN (ANALYZE, BUFFERS)](https://www.postgresql.org/docs/18/using-explain.html) with the actual sampled query to see how Postgres retrieves the rows and which pages it reads.

The sampling query uses `ORDER BY RANDOM()` across each table, which can warm data before the read tests even begin. A fixed seed makes sampling repeatable under consistent conditions; it doesn't guarantee identical samples across different table layouts.

## Testing UUIDv7

Postgres 18 provides a native [uuidv7() function](https://www.postgresql.org/docs/18/functions-uuid.html). A separate test can use it directly:

```sql
CREATE TABLE uuid7_native_table (
    id         UUID PRIMARY KEY DEFAULT uuidv7(),
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO uuid7_native_table (name) VALUES ('Example');
```

Leave `id` out of the insert so the default generates it. This example isn't part of the recorded results. It also puts ID generation inside the insert timing, while the ULID tests generate IDs beforehand. For a closer comparison of storage and insertion, generate genuine UUIDv7 values in advance too.

For an application already using ULIDs, native UUID storage is a useful starting point to test against BYTEA. The saved reads favor it, but I'd repeat the test with the application's queries, connection settings, and data size before choosing based on these numbers. UUIDv7 still needs its own verified run.
