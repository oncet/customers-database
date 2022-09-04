# customers-database

## Getting started

Start by cloning or downloading the source code and installing dependencies.

Then copy the `.env.example` file to `.env`:

```
cp .env.example .env
```

Run database migrations and seeder:

```
npm run db:reset
```

And finally start the app:

```
npm run dev
```

## Database scripts

To make it easier to run some Prisma CLI commands, the next npm scripts are available:

### `db:reset`

Resets the database. Applies migrations and runs seeders.

### `db:dev`

Generates migration files (`*.sql`) based on changes to [`schema.prisma`](./prisma/schema.prisma).

### `db:seed`

Runs the database seeder [`prisma/seed.ts`](./prisma/seed.ts).
