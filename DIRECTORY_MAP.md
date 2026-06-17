# Milimili 目录地图

Milimili 是一个基于 `pnpm workspace` 和 Turborepo 的全栈视频社区项目。仓库按 `apps`、`packages`、部署配置和工程配置拆分：前端负责 Next.js 用户界面，后端负责 REST API 与 Socket.IO，共享包承载前后端共用类型。

## 顶层结构

```text
.
├─ apps/                       # 可独立运行的应用
│  ├─ web/                     # Next.js 16 + React 19 前端
│  └─ server/                  # Express 5 + MongoDB + Redis 后端
├─ packages/                   # 工作区共享包
│  ├─ shared-types/            # 前后端共享 DTO、VO、Result、分页与 socket 类型
│  ├─ tailwind-config/         # 共享 Tailwind/PostCSS 包
│  └─ typescript-config/       # 共享 TypeScript 配置
├─ nginx/                      # 生产反向代理配置
├─ scripts/                    # 部署脚本
├─ .github/                    # CI/CD 工作流与部署说明
├─ docker-compose.yml          # 应用、MongoDB、Redis 编排
├─ Dockerfile.app              # 应用容器镜像构建
├─ package.json                # 根脚本、工作区依赖与 pnpm 版本
├─ pnpm-workspace.yaml         # workspace 范围
├─ turbo.json                  # Turborepo 任务编排
├─ eslint.config.mjs           # 根 ESLint flat config
├─ README.md                   # 项目说明与启动方式
└─ 技术栈.md                   # 技术栈清单
```

## 前端：`apps/web`

`apps/web` 是 Next.js App Router 应用，开发端口为 `3001`。路由文件保持轻量，页面主体逻辑优先落在 `src/features`。

```text
apps/web/
├─ src/
│  ├─ app/                     # App Router 路由、layout、page、not-found
│  │  ├─ (with-auth)/          # 需要登录态的页面组
│  │  ├─ category/[id]/        # 分类页
│  │  ├─ find-password/        # 找回密码页
│  │  ├─ hot/                  # 热门页
│  │  ├─ login/                # 登录页
│  │  ├─ search/               # 搜索页
│  │  ├─ layout.tsx            # 根布局
│  │  └─ page.tsx              # 首页
│  ├─ features/                # 按业务域组织的 API、组件、hooks、样式
│  ├─ components/              # 跨业务复用组件，含 layout/provider/ui
│  ├─ services/                # 与后端资源对应的请求封装
│  ├─ lib/                     # request、socket、toast、cn 等基础封装
│  ├─ stores/                  # Zustand stores
│  ├─ hooks/                   # 通用 React hooks
│  ├─ styles/                  # 全局样式、字体、主题
│  ├─ types/                   # 前端本地类型声明
│  ├─ utils/                   # 通用工具函数
│  └─ __test__/                # 前端 Vitest/Testing Library/Playwright 相关测试
├─ public/
│  └─ svgs/                    # 静态 SVG 资源与分类图标
├─ components.json             # shadcn/ui 配置
├─ next.config.ts              # Next.js 配置
├─ postcss.config.js           # Tailwind/PostCSS 配置
└─ package.json                # 前端脚本与依赖
```

### 前端业务域速查

- `features/home`：首页内容。
- `features/hot`：热门内容。
- `features/category`：分类浏览。
- `features/search`、`features/search-log`：搜索与搜索记录。
- `features/video`、`features/danmaku`：视频详情、播放器、弹幕。
- `features/comment`：评论与回复。
- `features/favorite`、`features/watch-later`、`features/history`：收藏、稍后再看、播放历史。
- `features/feed`：动态广场、转发、图片预览。
- `features/message`：私信、通知、消息上下文。
- `features/platform`：投稿与稿件管理。
- `features/space`、`features/user`、`features/follow`：个人空间、用户资料、关注关系。
- `features/auth`、`features/login`、`features/find-password`：登录、验证码、找回密码。

### 前端基础链路

- HTTP 请求入口：`apps/web/src/lib/request.ts`，开发环境默认请求 `http://localhost:3000/api/v1`。
- Socket.IO 入口：`apps/web/src/lib/socket.ts`，开发环境默认连接 `http://localhost:3000`。
- 前端本地 service：`apps/web/src/services/*.ts`。
- 前后端共享类型：从 `@mtobdvlb/shared-types` 引入。
- 路径别名：`@/*` 指向 `apps/web/src/*`。

## 后端：`apps/server`

`apps/server` 是 Express API 与 Socket.IO 服务，开发端口默认 `3000`。主链路是 `routes -> controllers -> services -> models`。

```text
apps/server/
├─ src/
│  ├─ app.ts                   # Express app：CORS、cookie、JSON、日志、限流、Swagger、路由、错误处理中间件
│  ├─ server.ts                # HTTP server、MongoDB 连接、Socket.IO 初始化、默认分类初始化
│  ├─ routes/                  # REST 路由注册，根路径挂在 /api/v1
│  ├─ controllers/             # 请求处理与响应组装
│  ├─ services/                # 业务逻辑与数据访问编排
│  ├─ models/                  # Mongoose models
│  ├─ socket/                  # Socket.IO 事件模块
│  ├─ middlewares/             # 鉴权、错误处理、限流、校验
│  ├─ config/                  # app、mongo、redis、jwt、email、oss 配置读取
│  ├─ utils/                   # jwt、bcrypt、cookie、redis、ali-oss、swagger、async-handler 等
│  ├─ constants/               # 常量
│  ├─ types/                   # Express/env/global 类型扩展
│  └─ __test__/                # 后端 controller/route/service/middleware/utils 测试
├─ tsconfig.json               # NodeNext + @/* 路径别名
└─ package.json                # 后端脚本与依赖
```

### 后端模块速查

- `auth`：验证码发送、刷新 token。
- `users`：登录、登出、用户信息、找回密码、账号维护。
- `categories`：分类初始化与查询。
- `videos`：视频列表、详情、投稿、分享、弹幕。
- `comments`：评论、回复、删除。
- `favorites`：收藏夹、收藏、稍后再看相关能力。
- `histories`：播放历史。
- `feeds`：动态发布、转发、关注流。
- `messages`：会话、私信、消息统计与已读。
- `follows`、`likes`、`searches`、`search-logs`、`commons`：关注、点赞、搜索、搜索记录、通用上传等。

### 后端基础链路

- API 根路径：`/api/v1`，注册入口 `apps/server/src/routes/index.ts`。
- Swagger：`apps/server/src/utils/swagger.util.ts`，挂载在 `app.ts`。
- MongoDB：`apps/server/src/config/mongo.ts`，启动时由 `server.ts` 连接。
- Redis：`apps/server/src/config/redis.ts` 与 `apps/server/src/utils/redis.util.ts`。
- Socket.IO：`apps/server/src/socket/index.ts`，由 `server.ts` 初始化。
- 路径别名：`@/*` 指向 `apps/server/src/*`。

## 共享包：`packages`

```text
packages/
├─ shared-types/
│  ├─ src/api/                 # 各资源返回结构、VO、接口类型
│  ├─ src/dtos/                # 请求 DTO 与 Zod schema
│  ├─ src/common/              # Result、Pagination、SocketResult 等通用结构
│  ├─ src/global.d.ts
│  ├─ src/index.ts             # barrel 导出入口
│  └─ tsup.config.ts           # 构建配置
├─ tailwind-config/
│  └─ postcss.config.js        # 共享 PostCSS/Tailwind 配置
└─ typescript-config/
   ├─ base.json                # 基础 TS 配置
   ├─ nextjs.json              # Next.js TS 配置
   └─ react-library.json       # React library TS 配置
```

`shared-types` 的 `src/index.ts` 以及各级 `index.ts` 会由 `barrelsby` 维护。新增或删除类型文件后，运行对应包的 `pnpm barrels` 或构建脚本刷新导出。

## 测试与质量入口

- 根测试：`pnpm test`
- 后端测试：`pnpm test:server`
- 前端测试：`pnpm test:web`
- lint：`pnpm lint`
- 类型检查：`pnpm check-types`
- 构建：`pnpm build`
- 格式化：`pnpm format`

测试配置位于：

- `apps/server/src/__test__/vitest.config.ts`
- `apps/web/src/__test__/vitest.config.ts`

## 环境与运行

- 安装依赖：`pnpm install`
- 启动数据库和缓存：`docker compose up -d mongo redis`
- 后端环境模板：`apps/server/.env.example`
- 启动开发环境：`pnpm dev`
- 前端地址：`http://localhost:3001`
- 后端 API：`http://localhost:3000/api/v1`
- Swagger：`http://localhost:3000/api-docs`

注意不要提交真实 `.env`、生产密钥、OSS key、邮箱密码、JWT secret 或数据库凭据。

## 部署相关

- `Dockerfile.app`：使用 `node:20-alpine` 构建 shared-types、server、web，并以 `start.sh` 同时启动后端和前端。
- `docker-compose.yml`：编排 `milimili`、`mongo`、`redis`，应用端口绑定在 `127.0.0.1:3000` 和 `127.0.0.1:3001`。
- `nginx/nginx.conf`：生产环境反向代理，`/api/` 与 `/socket.io/` 指向后端，其余流量指向 Next SSR。
- `.github/workflows/ci.yml`：CI。
- `.github/workflows/deploy.yml`：部署工作流。
- `.github/SETUP_CICD.md`：CI/CD 配置说明。
