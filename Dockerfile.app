# ================================
# 1. Build Stage
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 monorepo 必需文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/server ./apps/server
COPY apps/web ./apps/web
COPY packages ./packages

# 安装 pnpm
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/

# 安装依赖
RUN pnpm install --frozen-lockfile --shamefully-hoist

# 构建 shared-types
RUN pnpm -F @mtobdvlb/shared-types build

# 构建后端
RUN pnpm -F server build

# 构建前端
RUN pnpm -F web build

# ================================
# 2. Production Stage
# ================================
FROM node:20-alpine

WORKDIR /app

# 安装生产依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install --ignore-scripts --frozen-lockfile --shamefully-hoist

# 复制构建产物
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

# 安装 Nginx
RUN apk add --no-cache nginx

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/

# 创建前端静态目录
RUN mkdir -p /var/www/milimili
COPY --from=builder /app/apps/web/.next /var/www/milimili/.next
COPY --from=builder /app/apps/web/public /var/www/milimili/public

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 80

# 启动脚本
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
