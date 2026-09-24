---
layout: post
title: "Postgres: Search and Sort by Radial Distance"
date: 2013-12-11
comments: true
tags: [Postgres, SQL, Data, "radial distance", geoip]
thumbnail: https://images.unsplash.com/photo-1525211913837-7e58b5ad5adf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNlYXJjaCUyMGRpc3RhbmNlfGVufDB8fDB8fHww
---

Request users by radial distance and sort by nearest to farthest, vice versa, or whatever other attributes you'd like to include.

<!-- more -->

Searching for a user by distance, in your database, is easy with __Postgres__. Just create a users table with, at minimum, columns named _latitude_ and _longitude_.

## Data

``` bash
postgres=# SELECT * FROM users;
+----+------+----------+-----------+
| id | name | latitude | longitude |
+----+------+----------+-----------+
```

## SQL

```sql
SELECT name, distance
FROM
( SELECT name, ((ACOS(SIN(#{latitude} * PI() / 180) * SIN(u.latitude * PI() / 180) + COS(#{latitude} * PI() / 180) * COS(u.latitude * PI() / 180) * COS((#{longitude} - u.longitude) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) as distance
FROM users u ) d
WHERE distance <= 5
ORDER BY distance ASC;
```

Matches all users `WHERE distance <= 5` (less than or equal to five __miles__).

To change the distance to kilometers&mdash;multiply the output number by 1.609344 (1 mile == 1.609344 kilometers).

Replace `#{latitude}` with the value for the latitude you want to match against the database and do the same for `#{longitude}`

This will work in any SQL relational database, including __MySQL__ and __Oracle__.
