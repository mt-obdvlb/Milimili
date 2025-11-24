FROM node:20-alpine

WORKDIR /app

# 复制 monorepo 必须的文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

# 安装 pnpm
RUN npm install -g pnpm

# 使用淘宝源，加快安装
RUN pnpm config set registry https://registry.npmmirror.com/

# ⭐ 安装所有依赖（只执行一次！）
RUN pnpm install --frozen-lockfile --shamefully-hoist

# 构建 shared-types
RUN pnpm -F @mtobdvlb/shared-types build

# 构建后端
RUN pnpm -F server build

# 构建前端
RUN pnpm -F web build

# 安装 nginx
RUN apk add --no-cache nginx
RUN rm /etc/nginx/conf.d/default.conf

# 将 nginx 配置复制进去
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 前端构建产物复制到 nginx 的 root
RUN mkdir -p /var/www/milimili
RUN cp -r apps/web/.next /var/www/milimili/.next
RUN cp -r apps/web/public /var/www/milimili/public

# 启动脚本
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
