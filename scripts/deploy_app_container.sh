#!/bin/sh

set -eu

DEPLOY_PATH="${DEPLOY_PATH:-/root/milimili-cicd}"
APP_CONTAINER="${APP_CONTAINER:-milimili-app}"

if ! docker ps --format '{{.Names}}' | grep -Fx "$APP_CONTAINER" >/dev/null 2>&1; then
  echo "Container $APP_CONTAINER is not running"
  exit 1
fi

docker exec "$APP_CONTAINER" sh -lc '
  rm -rf /app/apps/server/dist /app/apps/web/.next &&
  mkdir -p /app/apps/server/dist /app/apps/web/.next
'

docker cp "$DEPLOY_PATH/apps/server/dist/." "$APP_CONTAINER:/app/apps/server/dist/"
docker cp "$DEPLOY_PATH/apps/web/.next/." "$APP_CONTAINER:/app/apps/web/.next/"

docker restart "$APP_CONTAINER"
