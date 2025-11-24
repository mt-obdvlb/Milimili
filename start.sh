#!/bin/sh

# 启动后端 Node.js
node apps/server/dist/server.js &

# 启动 Nginx
nginx -g 'daemon off;'
