#!/bin/sh

set -eu

DEPLOY_PATH="${DEPLOY_PATH:-/root/milimili-cicd}"
APP_CONTAINER="${APP_CONTAINER:-milimili-app}"
BACKUP_DIR="/tmp/milimili-deploy-backup-$(date +%s)"
DEPLOY_OK=0

if ! docker ps --format '{{.Names}}' | grep -Fx "$APP_CONTAINER" >/dev/null 2>&1; then
  echo "Container $APP_CONTAINER is not running"
  exit 1
fi

rollback() {
  if [ "$DEPLOY_OK" = "1" ]; then
    return
  fi

  echo "Deployment did not complete; restoring previous app artifacts"
  docker exec "$APP_CONTAINER" sh -lc "
    if [ -d '$BACKUP_DIR' ]; then
      rm -rf /app/apps/server/dist /app/apps/web/.next /app/apps/web/public
      mkdir -p /app/apps/server /app/apps/web
      if [ -d '$BACKUP_DIR/server-dist' ]; then cp -a '$BACKUP_DIR/server-dist' /app/apps/server/dist; fi
      if [ -d '$BACKUP_DIR/web-next' ]; then cp -a '$BACKUP_DIR/web-next' /app/apps/web/.next; fi
      if [ -d '$BACKUP_DIR/web-public' ]; then cp -a '$BACKUP_DIR/web-public' /app/apps/web/public; fi
      rm -rf '$BACKUP_DIR'
    fi
  " >/dev/null 2>&1 || true
  docker restart "$APP_CONTAINER" >/dev/null 2>&1 || true
}

trap rollback EXIT INT TERM

copy_if_exists() {
  src="$1"
  dest="$2"

  if [ -e "$src" ]; then
    docker cp "$src" "$APP_CONTAINER:$dest"
  fi
}

docker exec "$APP_CONTAINER" sh -lc "
  rm -rf '$BACKUP_DIR' &&
  mkdir -p '$BACKUP_DIR' &&
  if [ -d /app/apps/server/dist ]; then cp -a /app/apps/server/dist '$BACKUP_DIR/server-dist'; fi &&
  if [ -d /app/apps/web/.next ]; then cp -a /app/apps/web/.next '$BACKUP_DIR/web-next'; fi &&
  if [ -d /app/apps/web/public ]; then cp -a /app/apps/web/public '$BACKUP_DIR/web-public'; fi
"

docker exec "$APP_CONTAINER" sh -lc '
  rm -rf /app/apps/server/dist /app/apps/web/.next /app/apps/web/public &&
  mkdir -p \
    /app/apps/server \
    /app/apps/server/dist \
    /app/apps/web \
    /app/apps/web/.next \
    /app/apps/web/public \
    /app/apps/web/node_modules/.bin \
    /app/packages/shared-types \
    /app/packages/tailwind-config \
    /app/packages/typescript-config
'

copy_if_exists "$DEPLOY_PATH/package.json" "/app/package.json"
copy_if_exists "$DEPLOY_PATH/pnpm-lock.yaml" "/app/pnpm-lock.yaml"
copy_if_exists "$DEPLOY_PATH/pnpm-workspace.yaml" "/app/pnpm-workspace.yaml"
copy_if_exists "$DEPLOY_PATH/turbo.json" "/app/turbo.json"
copy_if_exists "$DEPLOY_PATH/.npmrc" "/app/.npmrc"
copy_if_exists "$DEPLOY_PATH/.env.production" "/app/.env.production"
copy_if_exists "$DEPLOY_PATH/start.sh" "/start.sh"

docker exec "$APP_CONTAINER" chmod +x /start.sh

copy_if_exists "$DEPLOY_PATH/apps/server/package.json" "/app/apps/server/package.json"
copy_if_exists "$DEPLOY_PATH/apps/web/package.json" "/app/apps/web/package.json"
copy_if_exists "$DEPLOY_PATH/apps/web/next.config.ts" "/app/apps/web/next.config.ts"
copy_if_exists "$DEPLOY_PATH/apps/web/.next-node-module-links.tsv" "/app/apps/web/.next-node-module-links.tsv"
copy_if_exists "$DEPLOY_PATH/packages/shared-types/package.json" "/app/packages/shared-types/package.json"
copy_if_exists "$DEPLOY_PATH/packages/tailwind-config/package.json" "/app/packages/tailwind-config/package.json"
copy_if_exists "$DEPLOY_PATH/packages/typescript-config/package.json" "/app/packages/typescript-config/package.json"

docker exec "$APP_CONTAINER" sh -lc '
  cd /app &&
  CI=true pnpm install --frozen-lockfile --shamefully-hoist --ignore-scripts
'

docker exec "$APP_CONTAINER" sh -lc '
  ln -sfn /app/node_modules/next /app/apps/web/node_modules/next &&
  ln -sfn /app/node_modules/.bin/next /app/apps/web/node_modules/.bin/next
'

docker cp "$DEPLOY_PATH/apps/server/dist/." "$APP_CONTAINER:/app/apps/server/dist/"
docker cp "$DEPLOY_PATH/apps/web/.next/." "$APP_CONTAINER:/app/apps/web/.next/"
if [ -d "$DEPLOY_PATH/apps/web/public" ]; then
  docker cp "$DEPLOY_PATH/apps/web/public/." "$APP_CONTAINER:/app/apps/web/public/"
fi

docker exec "$APP_CONTAINER" sh -lc '
  manifest=/app/apps/web/.next-node-module-links.tsv

  if [ -f "$manifest" ]; then
    mkdir -p /app/apps/web/.next/node_modules

    while IFS="$(printf "\t")" read -r link_name target; do
      [ -n "$link_name" ] || continue

      case "$link_name" in
        */*|.*|*" "*) continue ;;
      esac

      case "$target" in
        ../../../../node_modules/*)
          package_name="${target#../../../../node_modules/}"
          target_path="/app/node_modules/$package_name"

          if [ ! -e "$target_path" ]; then
            echo "Missing Next external module target: $target_path"
            exit 1
          fi

          ln -sfn "$target" "/app/apps/web/.next/node_modules/$link_name"
          ;;
      esac
    done < "$manifest"
  fi
'

docker restart "$APP_CONTAINER"

attempt=1
while [ "$attempt" -le 30 ]; do
  if docker exec "$APP_CONTAINER" node -e "Promise.all(['http://127.0.0.1:3000/api/v1/readyz','http://127.0.0.1:3001/','http://127.0.0.1:3001/login'].map((url)=>fetch(url))).then((responses)=>process.exit(responses.every((response)=>response.ok)?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    DEPLOY_OK=1
    docker exec "$APP_CONTAINER" rm -rf "$BACKUP_DIR" >/dev/null 2>&1 || true
    echo "Deployment health check passed"
    exit 0
  fi

  echo "Waiting for deployment readiness ($attempt/30)"
  attempt=$((attempt + 1))
  sleep 2
done

echo "Deployment health check failed"
exit 1
