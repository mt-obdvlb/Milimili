#!/bin/sh

# 启动 Node.js 后端
node apps/server/dist/server.js &

# 启动 nginx
nginx -g 'daemon off;'
