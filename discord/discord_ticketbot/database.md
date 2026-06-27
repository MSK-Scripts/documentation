---
title: Database
description: Database backends — SQLite (default), MySQL/MariaDB and PostgreSQL
sidebar_position: 2.5
---

## 🗄️ Database

The bot stores everything in a database that is created automatically on first
start. By default this is a local **SQLite** file — no setup required. You can
optionally point the bot at an external **MySQL/MariaDB** or **PostgreSQL**
database instead.

The backend is chosen with a single environment variable: `DATABASE_URL`.

---

## Choosing a backend

Set `DATABASE_URL` in your `.env`:

```bash
# Leave unset / empty → bundled SQLite file (data/tickets.db). Default.
# DATABASE_URL=""

# MySQL / MariaDB
DATABASE_URL="mysql://user:password@host:3306/ticketbot"

# PostgreSQL
DATABASE_URL="postgres://user:password@host:5432/ticketbot"

# SQLite at a custom path
DATABASE_URL="sqlite:./data/tickets.db"
```

| Backend | `DATABASE_URL` | Notes |
|---|---|---|
| **SQLite** (default) | *unset* or `sqlite:./path.db` | Zero setup — a file is created automatically. Best for single-server self-hosting. |
| **MySQL / MariaDB** | `mysql://…` or `mariadb://…` | Default port `3306`. |
| **PostgreSQL** | `postgres://…` or `postgresql://…` | Default port `5432`. |

> 💾 **No driver install needed.** The MySQL (`mysql2`) and PostgreSQL (`pg`)
> drivers ship with the bot — a normal `npm install` covers all three backends.

> 🔐 **Credentials belong in `.env`, never in `config.jsonc`.** The config file is
> editable through the hosted dashboard and must not contain database passwords.

---

## TLS / SSL

For managed databases that require an encrypted connection, append `?ssl=true`
(or `?sslmode=require`) to the URL:

```bash
DATABASE_URL="postgres://user:password@db.example.com:5432/ticketbot?ssl=true"
```

---

## Migrating an existing SQLite database

If you already ran the bot on SQLite and want to switch to MySQL or PostgreSQL,
copy your existing data with the bundled migration script — your ticket history,
ratings and statistics are preserved.

```bash
# Reads data/tickets.db, writes to the database in DATABASE_URL
npm run db:migrate
```

You can also pass the source and target explicitly:

```bash
node scripts/migrate-db.js --from ./data/tickets.db --to "postgres://user:pass@host:5432/ticketbot"
```

The script creates the target schema automatically, copies every table in
foreign-key-safe order with the original primary keys, and (on PostgreSQL) resets
the id sequences so newly created tickets don't collide.

> ⚠️ **Safety guard.** The migration aborts if the target database already
> contains data. Re-run with `--force` to write into a non-empty target anyway.

---

## How it works

- The schema is identical across all three engines; only the column types differ
  internally. Timestamps are stored as integers and booleans as `0/1`, so behaviour
  is the same regardless of the backend.
- Missing columns are added automatically on start (inline migrations), so updating
  the bot never requires manual database steps.
- Switching backends does **not** move your data automatically — use
  `npm run db:migrate` for that.

> ℹ️ **Existing SQLite users don't need to change anything.** Without
> `DATABASE_URL`, the bot keeps using `data/tickets.db` exactly as before.
