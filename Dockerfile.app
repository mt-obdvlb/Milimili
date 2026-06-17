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
# 4. 启动脚本
# -------------------------
COPY start.sh /start.sh
RUN chmod +x /start.sh

# -------------------------
# 5. 环境变量 + 端口
# -------------------------
ENV NODE_ENV=production
EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/v1/healthz').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# -------------------------
# 6. 启动容器
# -------------------------
CMD ["/start.sh"]
