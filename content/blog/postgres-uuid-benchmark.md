---
layout: post
title: "Postgres: Comparing ULID and UUIDv7 Primary Keys"
author: Michael Minter
date: 2026-09-30
description: "Comparing ULIDs stored as UUID and BYTEA with actual UUIDv7 IDs in Postgres: one million inserts, batch reads, and the measured differences."
comments: true
tags: [Postgres, SQL, UUID, UUIDv7, ULID, Rust, benchmarks]
---

If you're choosing a primary key for __Postgres__, how much difference does the identifier make? I put together a [Rust benchmark](https://github.com/michaelminter/postgres-uuid-benchmark) to compare ULIDs stored as native UUIDs, the same ULIDs stored as raw bytes, and actual UUIDv7 IDs.

__UUIDv7 had the lowest insert and average SELECT times in the saved run.__ Its insert time was 6.95% lower than UUID-stored ULIDs and 11.03% lower than BYTEA-stored ULIDs. The read difference between the two UUID strategies was much smaller.

<!-- more -->

## Storage

A [ULID](https://github.com/ulid/spec) contains a 48-bit timestamp and 80 bits of randomness. That's 128 bits, or 16 bytes. Its familiar 26-character string is an encoding of that value.

Postgres has a native [UUID type](https://www.postgresql.org/docs/18/datatype-uuid.html) for 128-bit identifiers. The benchmark takes one ULID and represents its bytes as either a UUID or BYTEA. UUIDv7 gets a separately generated identifier:

```rust
use ulid::Ulid;
use uuid::{NoContext, Timestamp, Uuid};

let bytes = Ulid::new().to_bytes();
let ulid_uuid = Uuid::from_bytes(bytes);
let ulid_bytes = bytes.to_vec();
let uuid7 = Uuid::new_v7(Timestamp::now(NoContext));
```

Representing a ULID as a UUID preserves its value. It doesn't turn it into UUIDv7. The third strategy generates real UUIDv7 IDs, and the benchmark checks their version and variant bits after insertion.

All three tables have a primary key, `name VARCHAR(255) NOT NULL`, and `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`. The ULID tables receive exactly the same IDs and names; the UUIDv7 table receives its own IDs with those same names.

| Strategy | Primary-key type | Identifier |
| --- | --- | --- |
| ULID stored as UUID | UUID | ULID's 16 bytes represented as a UUID |
| ULID stored as BYTEA | BYTEA | The same ULID's raw bytes |
| UUIDv7 | UUID | UUIDv7 generated in Rust |

Both ULIDs and UUIDv7 have leading timestamps. This implementation uses random ordering within each millisecond, so the comparison isn't between random UUIDv4 keys and time-ordered keys.

## Insert and Select Tests

IDs and names are generated in memory before timing starts. Each table is truncated before its insert test, then populated with __prepared multi-row INSERTs in one transaction__.

Insert timing includes parameter allocation, serialization, execution, and commit acknowledgment. ID generation, truncation, and statement preparation are outside the timer. Each strategy's insert workload is timed once per execution.

The read test samples IDs from each table and retrieves their records with a prepared query:

```sql
SELECT * FROM public.ulid_uuid_table WHERE id = ANY($1);
```

The parameter is a typed UUID or BYTEA array, depending on the table. Sampling and statement preparation happen before timing. Warm-up queries are followed by timed queries, with the mean and population standard deviation printed to the terminal.

Read timing includes serialization, database round trips, execution, result transfer, and decoding all three columns. __These are batch retrieval times__, not individual-row lookup latency or Postgres execution time alone.

The current defaults are 1,000 rows per insert batch, 10,000 IDs per SELECT, two warm-ups, and three timed SELECTs. The saved chart records one million rows per table and the timings, but doesn't preserve those other settings. The defaults aren't proof of the workload settings used for that run.

## Results

The updated [results report](https://github.com/michaelminter/postgres-uuid-benchmark/blob/main/RESULTS.md) records these timings. Insert throughput is calculated by dividing the one million rows by the insert duration.

| Strategy | Insert 1,000,000 rows | Insert throughput | Average SELECT time |
| --- | ---: | ---: | ---: |
| ULID stored as UUID | 2.344069 seconds | 426,609 rows/second | 43.426 milliseconds |
| ULID stored as BYTEA | 2.451393 seconds | 407,931 rows/second | 50.254 milliseconds |
| __UUIDv7__ | __2.181042 seconds__ | __458,496 rows/second__ | __43.035 milliseconds__ |

![Insert and average SELECT durations for ULID UUID, ULID BYTEA, and UUIDv7 primary keys, with one million rows per table](/images/posts/postgres-uuid-benchmark.svg)

UUIDv7 loaded the million rows about __163 milliseconds sooner__ than the UUID ULID table and __270 milliseconds sooner__ than the BYTEA ULID table.

Using each ULID strategy as the baseline:

| Compared with | UUIDv7 insert time reduction | UUIDv7 average SELECT time reduction |
| --- | ---: | ---: |
| ULID stored as UUID | 6.95% | 0.90% |
| ULID stored as BYTEA | 11.03% | 14.37% |

The calculated insert throughput was 7.47% higher than UUID-stored ULIDs and 12.40% higher than BYTEA-stored ULIDs. Those percentages differ from the time reductions because throughput is the inverse of elapsed time for a fixed amount of work.

For reads, UUIDv7 and UUID-stored ULIDs were close: __0.391 milliseconds per batch query__ separated their means. The difference versus BYTEA was __7.219 milliseconds per batch query__. Neither number is a per-row lookup saving.

The earlier Python version inserted ULIDs into the table labeled UUIDv7. These results replace its old timings and rankings; that earlier run wasn't evidence about actual UUIDv7 performance.

## Check the Query Plan

The benchmark runs `ANALYZE` before inserts and again after loading all tables. [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html) updates the statistics used by the query planner.

```sql
ANALYZE public.ulid_uuid_table;
ANALYZE public.ulid_bytea_table;
ANALYZE public.uuid7_table;
```

Updated statistics don't guarantee an index scan. Use [EXPLAIN (ANALYZE, BUFFERS)](https://www.postgresql.org/docs/18/using-explain.html) with the actual sampled query to inspect how Postgres retrieves the rows and which pages it reads.

Sampling uses `ORDER BY RANDOM()` outside the read timer, which can warm table data before the timed queries. A fixed seed controls the sampling sequence, but doesn't guarantee identical selected records across tables or separate executions.

All strategies run in a fixed order: UUID ULID, BYTEA ULID, then UUIDv7. Cache state and execution order can influence the result. The chart doesn't preserve SELECT standard deviations, hardware, or the PostgreSQL version, so it can't establish whether the small 0.90% read difference is repeatable.

Sessions also use `synchronous_commit = OFF`, `work_mem = '256MB'`, and `maintenance_work_mem = '512MB'`. With [synchronous commit disabled](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT), acknowledgment doesn't wait for WAL to be flushed durably. A crash can lose recent acknowledged transactions, and timings may differ when durable commit waits are enabled.

## Run the Comparison

Use a dedicated benchmark database. The `run` command truncates all three benchmark tables. Set the `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGHOST`, and `PGPORT` connection variables as needed, then run from the benchmark project:

```bash
cargo run --release -- setup
NUM_ROWS=1000000 BATCH_SIZE=1000 SAMPLE_SIZE=10000 NUM_TEST_RUNS=3 WARMUP_RUNS=2 \
  cargo run --release -- run --output benchmark-repeat.svg
```

This explicitly selects the current default workload. The benchmark supplies Rust-generated IDs for every strategy, so the table's SQL UUIDv7 default isn't part of the measurement. See the [README](https://github.com/michaelminter/postgres-uuid-benchmark#what-the-timings-measure) for the complete timing method and configuration.

Repeat complete executions and keep the console output, settings, hardware details, and PostgreSQL version alongside each chart.

UUIDv7 led both measured workloads in this execution. Its clearest read advantage was over BYTEA-stored ULIDs; reads against UUID-stored ULIDs were nearly tied. I'd use these findings as a reason to test UUIDv7 with my application's workload before choosing a primary key. This benchmark doesn't compare UUIDv4, integer keys, or text IDs, and the timings don't establish why the differences occurred or measure index size, page splits, storage savings, or concurrent load.
