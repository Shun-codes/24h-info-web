#!/usr/bin/env sh
set -eu

# Load local .env so npm scripts can pick up CONTAINER_CLI
if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

CLI=${CONTAINER_CLI:-docker}
exec "$CLI" compose "$@"
