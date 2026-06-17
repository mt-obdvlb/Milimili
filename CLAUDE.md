# Milimili Claude Code 指令

本文件供 Claude Code 在 Milimili 仓库中工作时读取。项目通用目录地图见 `DIRECTORY_MAP.md`，通用 agent 约定见 `AGENTS.md`。如果本文件与 `AGENTS.md` 信息重复，以更具体、更新的真实代码为准。

## 快速定位

- 根目录：monorepo 配置、根脚本、Docker/Nginx/CI 配置。
- `apps/web`：Next.js 前端应用，端口 `3001`。
- `apps/server`：Express API + Socket.IO 后端，端口 `3000`。
- `packages/shared-types`：前后端共享 DTO、VO、Result、分页和 socket 类型。
- `packages/typescript-config`：共享 TypeScript 配置。
- `packages/tailwind-config`：共享 Tailwind/PostCSS 配置。

## Claude 工作规则

- 先阅读相关文件，再提出或执行修改。不要仅凭框架经验推断本仓库结构。
- 默认使用 `pnpm`，不要切到 `npm` 或 `yarn`。
- 搜索文件和文本优先用 `rg` / `rg --files`。
- 修改保持局部，不做无关重构、全仓格式化或大规模重排。
- 不要覆盖用户未提交改动；看到工作区已有修改时先判断是否相关。
- 不要输出 `.env`、`.env.production` 或任何 secret 的真实值。
- 完成实现后运行与改动匹配的最小验证；不能运行时说明原因。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm test
pnpm test:server
pnpm test:web
```

按应用运行：

```bash
pnpm --filter web dev
pnpm --filter server dev
pnpm --filter @mtobdvlb/shared-types build
```

本地依赖服务：

```bash
docker compose up -d mongo redis
```

## 前端修改提示

- 路由在 `apps/web/src/app`。
- 业务域在 `apps/web/src/features`。
- 通用组件在 `apps/web/src/components`。
- 请求封装在 `apps/web/src/lib/request.ts` 和 `apps/web/src/services`。
- Socket 客户端在 `apps/web/src/lib/socket.ts`。
- Zustand stores 在 `apps/web/src/stores`。
- `@/*` 指向 `apps/web/src/*`。
- 需要新增 UI 时优先复用现有 shadcn/ui、Radix UI、lucide-react、Tailwind 体系。

## 后端修改提示

- Express app 在 `apps/server/src/app.ts`。
- 启动和 MongoDB 连接在 `apps/server/src/server.ts`。
- REST 路由从 `apps/server/src/routes/index.ts` 挂到 `/api/v1`。
- 常规链路是 `routes -> controllers -> services -> models`。
- Socket.IO 模块在 `apps/server/src/socket`。
- 配置读取在 `apps/server/src/config`。
- 中间件在 `apps/server/src/middlewares`。
- `@/*` 指向 `apps/server/src/*`。
- 新接口优先补齐或复用 `packages/shared-types` 中的 DTO/API 类型。

## 共享类型与 barrel

`packages/shared-types` 使用 `barrelsby` 维护导出。新增、删除或移动共享类型文件后，运行：

```bash
pnpm --filter @mtobdvlb/shared-types build
```

前端也有 `pnpm barrels` 脚本，`apps/web/src/app` 被排除。不要把路由目录纳入 barrel 生成。

## 验证选择

- 文档变更：检查路径、命令、端口和目录描述是否与真实文件一致。
- 前端变更：优先 `pnpm --filter web check-types`，必要时 `pnpm test:web`。
- 后端变更：优先 `pnpm test:server`，必要时 `pnpm --filter server build`。
- 共享类型变更：`pnpm --filter @mtobdvlb/shared-types build` 后再 `pnpm check-types`。
- 跨端变更：至少跑类型检查和相关测试，必要时启动 `pnpm dev` 验证真实链路。

## 不要做

- 不要提交或泄露真实环境变量。
- 不要手改构建产物、缓存目录或依赖目录。
- 不要无关更新 `pnpm-lock.yaml`。
- 不要绕过 `apps/web/src/lib/request.ts` 或 `apps/server/src/routes/index.ts` 新建平行链路。
- 不要把业务逻辑堆进前端 route page 或后端 route 文件。
