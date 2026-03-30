#!/bin/sh

set -eu

DEPLOY_PATH="${DEPLOY_PATH:-/root/milimili-cicd}"
APP_CONTAINER="${APP_CONTAINER:-milimili-app}"

if ! docker ps --format '{{.Names}}' | grep -Fx "$APP_CONTAINER" >/dev/null 2>&1; then
  echo "Container $APP_CONTAINER is not running"
  exit 1
fi

copy_if_exists() {
  src="$1"
  dest="$2"

  if [ -e "$src" ]; then
    docker cp "$src" "$APP_CONTAINER:$dest"
  fi
}

docker exec "$APP_CONTAINER" sh -lc '
  rm -rf /app/apps/server/dist /app/apps/web/.next &&
  mkdir -p \
    /app/apps/server \
    /app/apps/web \
    /app/packages/shared-types \
    /app/packages/tailwind-config \
    /app/packages/typescript-config
'

copy_if_exists "$DEPLOY_PATH/package.json" "/app/package.json"
copy_if_exists "$DEPLOY_PATH/pnpm-lock.yaml" "/app/pnpm-lock.yaml"
copy_if_exists "$DEPLOY_PATH/pnpm-workspace.yaml" "/app/pnpm-workspace.yaml"
copy_if_exists "$DEPLOY_PATH/turbo.json" "/app/turbo.json"
copy_if_exists "$DEPLOY_PATH/.npmrc" "/app/.npmrc"

copy_if_exists "$DEPLOY_PATH/apps/server/package.json" "/app/apps/server/package.json"
copy_if_exists "$DEPLOY_PATH/apps/web/package.json" "/app/apps/web/package.json"
copy_if_exists "$DEPLOY_PATH/packages/shared-types/package.json" "/app/packages/shared-types/package.json"
copy_if_exists "$DEPLOY_PATH/packages/tailwind-config/package.json" "/app/packages/tailwind-config/package.json"
copy_if_exists "$DEPLOY_PATH/packages/typescript-config/package.json" "/app/packages/typescript-config/package.json"

docker exec "$APP_CONTAINER" sh -lc '
  cd /app &&
  CI=true pnpm install --prod --frozen-lockfile --prefer-offline --shamefully-hoist --ignore-scripts
'

docker cp "$DEPLOY_PATH/apps/server/dist/." "$APP_CONTAINER:/app/apps/server/dist/"
docker cp "$DEPLOY_PATH/apps/web/.next/." "$APP_CONTAINER:/app/apps/web/.next/"

docker restart "$APP_CONTAINER"
