---
title: Database & Migration
sidebar_position: 4
description: msk_handcuffs v3 stores status in MySQL via oxmysql. The msk_handcuffs table schema and the automatic, idempotent migration from the legacy database.json.
keywords:
  - msk_handcuffs database
  - oxmysql
  - database.json migration
  - msk_handcuffs table schema
---

# Database & Migration

Since v3.0.0 all status is stored in **MySQL via oxmysql** instead of the old
`database.json` flat file. The in-memory state is the runtime source of truth and is
mirrored to MySQL so it survives restarts and relogs.

## Table schema

Created automatically on first start — no manual `.sql` import needed.

```sql
CREATE TABLE IF NOT EXISTS `msk_handcuffs` (
    `identifier` VARCHAR(64) NOT NULL,
    `isCuffed` TINYINT(1) NOT NULL DEFAULT 0,
    `cuffItem` VARCHAR(64) DEFAULT NULL,
    `isAdminCuffed` TINYINT(1) NOT NULL DEFAULT 0,
    `isHardcuffed` TINYINT(1) NOT NULL DEFAULT 0,
    `hardcuffItem` VARCHAR(64) DEFAULT NULL,
    `hasAnkleTracker` TINYINT(1) NOT NULL DEFAULT 0,
    `hasHeadbag` TINYINT(1) NOT NULL DEFAULT 0,
    `hasTape` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

`identifier` is the framework identifier from msk_core:
- **ESX** → license identifier (without the `license:` prefix)
- **QBCore** → `citizenid`

Rows are removed automatically once a player has no active status left, keeping the table clean.

## Automatic migration from `database.json`

If a legacy `database.json` exists on first start, msk_handcuffs imports it **once**:

1. Each identifier that does **not** already exist in MySQL is inserted (non-destructive).
2. The legacy key `ankleTracker` is normalized to `hasAnkleTracker`.
3. The original file is backed up to **`database.migrated.bak.json`**.
4. `database.json` is reset to `{}` so the migration never runs twice.

You will see a log line like:

```
[msk_handcuffs] Migrated 42 entries from database.json to MySQL (backup: database.migrated.bak.json).
```

:::tip
The migration is idempotent and safe to leave in place. After a successful migration you
can delete `database.json` and `database.migrated.bak.json` if you no longer need the backup.
:::

## Reading status

Prefer **[statebags](./statebags.md)** for live reads, or the
[exports](./exports/server.md) for identifier/offline lookups. Direct SQL access is not
required for integrations.
