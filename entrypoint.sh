#!/bin/sh

set -e

echo "Running database migrations..."
pnpm migration:run

echo "Running database seeder..."
pnpm db:seed

exec "$@"