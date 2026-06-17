#!/bin/sh

set -eu

shutdown() {
  kill "$SERVER_PID" "$WEB_PID" 2>/dev/null || true
  wait "$SERVER_PID" "$WEB_PID" 2>/dev/null || true
}

trap shutdown INT TERM

# -------------------------
# 启动 Node.js 后端 API
# -------------------------
node apps/server/dist/server.js &
SERVER_PID=$!

# -------------------------
# 启动 Next.js SSR 前端
# -------------------------
pnpm -F web start &   # 默认监听 3001
WEB_PID=$!

# -------------------------
# 保持容器前台运行
# -------------------------
wait -n
shutdown
