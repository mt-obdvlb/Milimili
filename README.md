# Milimili

Milimili 是一个基于 Monorepo 架构的全栈视频社区项目，围绕“内容消费 + 上传创作 + 社交互动 + 实时消息”这条主链路构建。仓库同时包含前端用户端、后端 API 服务以及前后端共享模块，适合作为视频社区类产品、复杂前后端分离项目、或 Monorepo 工程化实践的参考。

## 项目亮点

- 基于 `pnpm workspace + Turborepo` 管理前端、后端与共享包
- 前端使用 `Next.js 16 + React 19 + TypeScript`，采用 App Router
- 后端使用 `Express 5 + MongoDB + Redis + Socket.IO`
- 通过 `@mtobdvlb/shared-types` 共享 DTO、返回结构与类型定义
- 支持视频上传、播放器、弹幕、评论、点赞、收藏、稍后再看、动态、私信、通知等完整互动链路
- 提供 `Swagger` 接口文档、`Docker` 容器化运行、`GitHub Actions` 构建与部署流程

## 功能概览

### 用户侧

- 首页推荐、热门分区、分类浏览
- 视频详情页、弹幕互动、评论回复
- 搜索与搜索历史
- 点赞、收藏、稍后再看、播放历史
- 个人空间、关注/粉丝关系
- 动态 Feed 浏览与转发
- 私信会话、系统通知、@ 提及、回复提醒
- 验证码登录、找回密码、账号信息维护

### 创作者侧

- 视频上传与编辑
- 投稿管理
- 个人空间作品展示

### 服务侧

- REST API + WebSocket 双通道
- JWT 鉴权与刷新
- Redis 限流、验证码与状态缓存
- 阿里云 OSS 文件上传
- Swagger API 文档输出

## 技术栈

| 层级       | 技术                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| 前端       | Next.js 16、React 19、TypeScript、Tailwind CSS 4、shadcn/ui、Radix UI           |
| 前端状态   | TanStack Query、Zustand、Axios、React Hook Form、Zod                            |
| 媒体与交互 | Socket.IO Client、Tiptap、react-dropzone、mp4box、comment-core-library、dnd-kit |
| 后端       | Node.js、Express 5、TypeScript、Socket.IO                                       |
| 数据层     | MongoDB、Mongoose、Redis、BullMQ                                                |
| 基础能力   | JWT、bcrypt、Nodemailer、Ali OSS、Swagger                                       |
| 工程化     | pnpm workspace、Turborepo、ESLint、Prettier、Husky、lint-staged                 |
| 部署       | Docker、Docker Compose、Nginx、GitHub Actions                                   |

## 仓库结构

```text
Milimili/
├─ apps/
│  ├─ web/                    # Next.js 前端应用
│  └─ server/                 # Express API + Socket.IO 服务
├─ packages/
│  ├─ shared-types/           # 前后端共享 DTO、类型与返回结构
│  ├─ tailwind-config/        # 共享 Tailwind / PostCSS 配置
│  └─ typescript-config/      # 共享 TypeScript 配置
├─ nginx/                     # Nginx 反向代理配置
├─ scripts/                   # 部署脚本
├─ .github/workflows/         # CI / CD 工作流
├─ docker-compose.yml         # 容器编排
├─ Dockerfile.app             # 应用镜像构建文件
└─ turbo.json                 # Turborepo 任务编排配置
```

## 主要页面与业务模块

### 前端页面

- `/`：首页推荐
- `/hot`：热门内容
- `/search`：搜索页
- `/category/[id]`：分类页
- `/video/[videoId]`：视频详情页
- `/feed`：动态广场
- `/message`：消息中心
- `/space/[userId]`：个人空间
- `/platform/upload`：投稿页
- `/platform/upload-manager`：稿件管理

### 后端接口模块

- `auth`：验证码发送、令牌刷新
- `users`：登录、登出、个人信息、找回密码
- `videos`：视频列表、详情、投稿、分享、弹幕
- `comments`：评论、回复、删除
- `favorites`：收藏夹、稍后再看
- `histories`：播放历史
- `feeds`：动态发布、转发、关注流
- `messages`：会话、私信、消息统计与已读
- `follows` / `likes` / `searches` / `search-logs` / `categories`

## 快速开始

### 1. 环境要求

- Node.js `>= 18`，推荐 `20`
- pnpm `>= 10`
- MongoDB
- Redis

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

先复制后端环境变量模板：

```bash
cp apps/server/.env.example apps/server/.env
```

至少需要根据你的本地环境修改这些值：

- `PORT`
- `FRONTEND_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `REDIS_URI`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `EMAIL_USER`
- `EMAIL_PASS`
- `OSS_REGION`
- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`
- `OSS_BUCKET`

如果你只想先跑通前后端基本链路，建议先把 MongoDB、Redis、JWT、前端地址配好；邮箱验证码和 OSS 上传相关功能需要额外配置。

### 4. 启动 MongoDB 与 Redis

如果本地已经安装 MongoDB / Redis，可以直接使用本地服务。

如果想借助 Docker 启动依赖服务，可以只启动数据库与缓存：

```bash
docker compose up -d mongo redis
```

注意：仓库里的 `docker-compose.yml` 默认会编排 `milimili`、`mongo`、`redis` 三个服务；本地开发通常只需要数据库和缓存即可。

补充说明：仓库自带的 `redis` 容器默认没有预设密码，使用时请同步调整 `apps/server/.env` 中的 `REDIS_URI` / `REDIS_PASSWORD`，保证和你的本地 Redis 配置一致。

### 5. 启动开发环境

```bash
pnpm dev
```

该命令会通过 Turborepo 同时启动：

- `apps/web`
- `apps/server`
- `packages/shared-types`

默认访问地址：

- 前端：`http://localhost:3001`
- 后端 API：`http://localhost:3000/api/v1`
- Swagger 文档：`http://localhost:3000/api-docs`

## 常用命令

### 根目录

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm format
```

### 按应用单独运行

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start

pnpm --filter server dev
pnpm --filter server build
pnpm --filter server start

pnpm --filter @mtobdvlb/shared-types dev
pnpm --filter @mtobdvlb/shared-types build
```

## 环境变量说明

### `apps/server/.env`

| 变量名                                                                      | 说明                                  |
| --------------------------------------------------------------------------- | ------------------------------------- |
| `PORT`                                                                      | 后端服务端口，默认开发环境使用 `3000` |
| `FRONTEND_URL`                                                              | 前端站点地址，用于 CORS               |
| `MONGO_URI`                                                                 | MongoDB 连接串                        |
| `JWT_SECRET`                                                                | JWT 密钥                              |
| `JWT_ACCESS_EXPIRES_IN`                                                     | Access Token 有效期                   |
| `JWT_REFRESH_EXPIRES_IN`                                                    | Refresh Token 有效期                  |
| `REDIS_URI`                                                                 | Redis 连接串                          |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD`                              | Redis 连接配置                        |
| `EMAIL_USER` / `EMAIL_PASS`                                                 | 邮件发送配置，用于验证码/找回密码     |
| `OSS_REGION` / `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` / `OSS_BUCKET` | 对象存储配置，用于文件上传            |

### 前端部署时可选变量

前端代码中还会读取以下变量：

| 变量名                | 说明                                                    |
| --------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | 前端请求 API 的基础路径，生产环境默认是 `/api/v1`       |
| `NEXT_PUBLIC_WS_URL`  | 前端连接 Socket.IO 的地址，生产环境默认是 `/socket.io/` |

本地开发时，前端请求默认会直连 `http://localhost:3000/api/v1`，通常不需要额外设置。

## 架构说明

### Monorepo 分层

- `apps/web`：负责用户界面、路由、交互与状态管理
- `apps/server`：负责 REST API、鉴权、消息、上传、实时通信
- `packages/shared-types`：负责共享 DTO、返回结构和类型约束
- `packages/tailwind-config`：负责样式配置复用
- `packages/typescript-config`：负责 TypeScript 配置复用

### 通信方式

- HTTP：业务 API 调用
- Socket.IO：私信与通知等实时场景
- Redis：限流、缓存、验证码与部分实时能力支撑
- MongoDB：核心业务数据存储

## 部署方式

### 方式一：Docker + Nginx

仓库已经提供以下文件：

- `Dockerfile.app`
- `docker-compose.yml`
- `nginx/nginx.conf`
- `start.sh`

当前部署设计是：

- `Node.js` 进程启动后端服务
- `Next.js` 以 SSR 方式启动前端服务
- `Nginx` 统一反代 `/api`、`/socket.io` 与页面流量

如果你要构建完整镜像并运行整套服务，可以基于现有 Dockerfile 和 Compose 继续扩展生产配置。

### 方式二：GitHub Actions 自动部署

仓库已包含两条工作流：

- `CI`：安装依赖并构建 `shared-types`、`server`、`web`
- `Deploy`：在 `main` 分支 CI 成功后，把构建产物同步到服务器并重启应用容器

相关说明可见：

- [`.github/SETUP_CICD.md`](./.github/SETUP_CICD.md)

### 方式三：前端单独部署到 Vercel

`apps/web` 中已经提供 `vercel-build` 脚本，用于在构建前先编译共享包：

```bash
pnpm --filter web vercel-build
```

如果你计划把前端单独部署到 Vercel，需要注意：

- 后端 API、MongoDB、Redis、Socket.IO 仍需独立部署
- `NEXT_PUBLIC_API_URL`、`NEXT_PUBLIC_WS_URL` 需要指向可访问的后端地址
- 后端 `FRONTEND_URL` 需要配置为你的前端线上域名

也就是说，当前仓库更适合“前端单独上 Vercel，后端与基础设施自托管”的模式，而不是把整套服务直接无改造部署到 Vercel。

## 开发说明

### API 文档

开发环境启动后可访问：

```text
http://localhost:3000/api-docs
```

### 默认分类初始化

后端首次连接 MongoDB 时，会自动写入一批默认视频分类。如果数据库中已有分类数据，则不会重复初始化。

## License

MIT
