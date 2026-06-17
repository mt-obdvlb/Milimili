# Milimili Agent 指令

本文件是项目级 agent 指令，适用于在本仓库中工作的 Codex、Claude Code 或其他代码 agent。优先遵守用户当前消息；如果用户消息、本文件和已有代码冲突，先说明冲突点，再选择最小风险路径。

## 项目事实

- Milimili 是 `pnpm workspace + Turborepo` monorepo。
- 前端应用在 `apps/web`，技术栈是 Next.js 16、React 19、TypeScript、Tailwind CSS 4、shadcn/ui、TanStack Query、Zustand、Axios、Socket.IO Client。
- 后端应用在 `apps/server`，技术栈是 Express 5、TypeScript、MongoDB/Mongoose、Redis/ioredis、Socket.IO、JWT、Swagger、Ali OSS、Nodemailer。
- 前后端共享类型在 `packages/shared-types`，包名是 `@mtobdvlb/shared-types`。
- API 根路径是 `/api/v1`，开发环境前端默认 `3001`，后端默认 `3000`。
- 目录地图见 `DIRECTORY_MAP.md`，修改陌生模块前先查该文件和对应真实代码。

## 工作原则

- 先读真实文件、真实配置、真实入口和现有测试，再改代码。不要把常见 Next.js/Express 写法当作本仓库事实。
- 改动保持小范围，尊重当前目录分层，不做无关重构、格式化或依赖升级。
- 不要回滚、覆盖或删除用户已有修改，除非用户明确要求。
- 涉及密钥、账号、邮箱、OSS、JWT、数据库连接串时，只确认变量名和配置路径，不输出真实值。
- 新增业务能力时，同步考虑前后端共享类型、后端路由/controller/service/model、前端 service/features，以及测试覆盖。
- 修改生成型 barrel 文件前先确认是否应由 `barrelsby` 生成。新增或删除导出文件后优先运行对应 `pnpm barrels` 或构建脚本刷新。

## 包管理与命令

使用 `pnpm`，不要无故切换到 `npm` 或 `yarn`。根目录常用命令：

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm test
pnpm test:server
pnpm test:web
pnpm format
```

按包运行：

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
pnpm --filter server dev
pnpm --filter server build
pnpm --filter server start
pnpm --filter @mtobdvlb/shared-types build
```

测试默认带 `TZ=Asia/Shanghai`，根脚本已配置。实现类任务完成后，尽量运行与改动匹配的最小验证命令；不能验证时说明原因。

## 前端约定

- 路由文件在 `apps/web/src/app`，尽量保持页面文件薄；业务组件、API、hooks 放到 `apps/web/src/features/<domain>`。
- 跨业务通用组件放 `apps/web/src/components`，基础 UI 放 `apps/web/src/components/ui`。
- HTTP 请求统一经过 `apps/web/src/lib/request.ts`，不要在组件里直接散落 Axios baseURL 配置。
- Socket.IO 客户端统一经过 `apps/web/src/lib/socket.ts`。
- 前端资源请求封装在 `apps/web/src/services`，业务域 API 也可能在 `features/<domain>/api.ts`。
- 状态管理优先沿用现有 Zustand stores、TanStack Query 和本地 hooks。
- 路径别名 `@/*` 指向 `apps/web/src/*`。
- 使用已有 shadcn/ui、Radix UI、lucide-react、Tailwind 体系；不要引入新的 UI 框架。
- `apps/web/src/app` 被 `barrelsby` 排除，不要尝试为路由生成 barrel。

## 后端约定

- Express app 入口是 `apps/server/src/app.ts`，启动入口是 `apps/server/src/server.ts`。
- REST 注册入口是 `apps/server/src/routes/index.ts`，所有路由挂在 `/api/v1`。
- 后端主分层是 `routes -> controllers -> services -> models`。
- 通用中间件在 `apps/server/src/middlewares`，配置读取在 `apps/server/src/config`，工具函数在 `apps/server/src/utils`。
- Socket.IO 服务在 `apps/server/src/socket`，由 `server.ts` 初始化。
- MongoDB model 放 `apps/server/src/models`，业务逻辑不要塞进 route 文件。
- 路径别名 `@/*` 指向 `apps/server/src/*`。
- 接口请求/响应类型优先复用或补充 `@mtobdvlb/shared-types`，避免前后端各写一套结构。

## 共享类型约定

- `packages/shared-types/src/dtos` 放请求 DTO 和 Zod schema。
- `packages/shared-types/src/api` 放接口返回结构、VO 和资源相关 API 类型。
- `packages/shared-types/src/common` 放 `Result`、分页、Socket 结果等通用结构。
- 修改共享类型后，优先运行：

```bash
pnpm --filter @mtobdvlb/shared-types build
pnpm check-types
```

## 环境与本地运行

- 后端环境模板是 `apps/server/.env.example`。
- 本地依赖服务可用 `docker compose up -d mongo redis` 启动。
- 开发启动通常用 `pnpm dev`，会由 Turborepo 同时启动 web、server 和 shared-types。
- Swagger 默认在 `http://localhost:3000/api-docs`。
- 不要提交真实 `.env`、`.env.production`、OSS key、邮箱密码、JWT secret 或数据库凭据。

## 验证建议

按改动范围选择最小验证：

- 只改文档：检查 Markdown 内容与路径准确性。
- 只改前端组件/页面：`pnpm --filter web check-types`，必要时 `pnpm test:web` 或启动前端检查渲染。
- 只改后端逻辑：`pnpm test:server`，必要时 `pnpm --filter server build`。
- 改共享类型：`pnpm --filter @mtobdvlb/shared-types build` 和 `pnpm check-types`。
- 跨前后端链路：优先跑 `pnpm check-types`、相关测试，再按需要启动 `pnpm dev` 做真实接口/页面验证。

## 文件与目录禁区

- 不要手动改 `node_modules`、`dist`、`.next`、覆盖率输出或其他构建产物。
- 不要无关改动 `pnpm-lock.yaml`；只有依赖确实变化时才更新。
- 不要为统一风格重排全仓文件。
- 不要在文档或日志里粘贴真实 secret。
