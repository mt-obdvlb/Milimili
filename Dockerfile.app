FROM node:20-alpine

WORKDIR /app

# -------------------------
# 1. 复制项目
# -------------------------
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

# -------------------------
# 2. 安装 pnpm + 依赖
# -------------------------
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install --frozen-lockfile --shamefully-hoist

# -------------------------
# 3. 构建 shared-types / 后端 / 前端
# -------------------------
RUN pnpm -F @mtobdvlb/shared-types build
RUN pnpm -F server build
RUN pnpm -F web build

# -------------------------
# 4. 安装 nginx（可选，只反代 /api）
# -------------------------
RUN apk add --no-cache nginx

# -------------------------
# 5. 配置 nginx
# -------------------------
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# -------------------------
# 6. 启动脚本
# -------------------------
COPY start.sh /start.sh
RUN chmod +x /start.sh

# -------------------------
# 7. 环境变量 + 端口
# -------------------------
ENV NODE_ENV=production
EXPOSE 80 3000 3001
 # 3000 后端, 3001 前端 SSR

# -------------------------
# 8. 启动容器
# -------------------------
CMD ["/start.sh"]
