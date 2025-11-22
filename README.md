# Milimili - 视频社交平台

Milimili 是一个基于 Monorepo
架构的视频社交平台，集成视频播放、弹幕互动、动态分享、实时消息等核心功能，采用前后端分离设计，支持高并发场景下的流畅用户体验。

## 项目架构概览

项目采用 Monorepo 组织形式，通过 Turborepo
实现多包管理，核心分为前端、后端、共享模块三大模块，整体结构清晰、扩展性强。

```
mtobdvlb-milimili/
├─ apps/                # 核心应用
│  ├─ web/              # 前端 Next.js 项目（用户端）
│  └─ server/           # 后端 Node.js + Express 项目（API 服务）
├─ packages/            # 共享模块
│  ├─ shared-types/     # 前后端共享类型定义
│  ├─ tailwind-config/  # 共享 Tailwind 配置
│  └─ typescript-config/# 共享 TypeScript 配置
├─ 配置文件              # 包管理、代码检查、构建相关配置
└─ README.md            # 项目说明文档
```

## 核心功能

### 1. 视频相关

- 视频上传、分类、
- 自定义视频播放器（支持进度控制、音量调节）
- 播放历史记录自动同步

### 2. 社交互动

- 视频点赞、收藏、评论（支持回复层级）
- 收藏夹分类管理
- 用户关注与粉丝体系
- 动态 Feed 流（分享、互动动态展示）

### 3. 实时通信

- 一对一私信聊天
- 系统通知、@提及、点赞/回复提醒

### 4. 其他功能

- 视频搜索（支持关键词匹配）
- 热门视频推荐
- 个人空间（展示作品、收藏、关注关系）
- 账号安全（验证码登录、密码找回）

## 技术栈详情

### 前端（web）

- 框架：Next.js 14（App Router）
- 语言：TypeScript
- 样式方案：Tailwind CSS + 共享样式配置
- 状态管理：Zustand（局部状态）、React Query（服务端状态缓存）
- UI 组件：shadcn/ui + 自定义业务组件
- 核心库：
  - Axios（HTTP 请求）
  - React Hook Form + Zod（表单校验）
  - Framer Motion（动画效果）
  - react-dropzone（文件上传）

### 后端（server）

- 框架：Node.js + Express.js
- 语言：TypeScript
- 数据存储：
  - MongoDB（核心业务数据存储）
  - Redis（缓存、限流、会话管理）
- 认证授权：JWT（Access Token + Refresh Token）
- 文件存储：阿里云 OSS（通过 ali-oss 工具类集成）
- 核心中间件：认证拦截、请求校验、错误处理、接口限流

### 数据库设计

- 主数据库：MongoDB（文档型数据库，灵活存储非结构化数据）
-

核心数据模型：User、Video、Danmaku、Comment、Like、Favorite、Follow、Message、Feed
等

- 缓存数据库：Redis

### 通信方式

- HTTP REST API：常规业务请求（用户操作、数据查询）
- WebSocket（Socket.io）：实时场景（私信）
- JWT：用户身份认证与会话维持
- Redis：服务端缓存与跨服务数据共享

### 开发工具链

- 包管理：pnpm（高效、快速的包管理器）
- 构建工具：Turborepo（Monorepo 构建优化）
- 代码检查：ESLint（代码规范校验）
- 类型检查：TypeScript（静态类型校验）
- 配置共享：统一 TypeScript、Tailwind 配置，保证多包一致性

## 快速开始

### 前置依赖

- Node.js ≥ 18.x
- pnpm ≥ 8.x
- MongoDB ≥ 5.x
- Redis ≥ 6.x

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/mt-obdvlb/Milimili
cd Milimili
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

- 后端：在 `apps/server` 目录创建 `.env`，配置 MongoDB
  连接、Redis 地址、JWT 密钥、OSS 配置等

4. 启动开发环境

```bash
# 同时启动前后端开发服务
pnpm dev

# 单独启动前端
pnpm dev:web

# 单独启动后端
pnpm dev:server
```

5. 访问应用

- 前端：http://localhost:3001
- 后端 API：http://localhost:3000

## 项目结构说明

### 前端核心目录（apps/web/src）

```
src/
├─ app/              # Next.js App Router 路由
│  ├─ (with-auth)/   # 需登录访问的页面（个人中心、消息等）
│  └─ 公开页面（首页、登录、搜索、视频详情等）
├─ components/       # 通用 UI 组件、布局组件
├─ features/         # 业务功能模块（按功能拆分，含组件、API 调用）
├─ hooks/            # 自定义 React Hooks
├─ lib/              # 工具函数、请求封装、Socket 初始化
├─ services/         # API 服务封装（按业务模块拆分）
├─ stores/           # 状态管理存储
├─ styles/           # 全局样式、字体配置
└─ types/            # 前端类型定义（共享类型来自 shared-types）
```

### 后端核心目录（apps/server/src）

```
src/
├─ config/           # 配置文件（数据库、JWT、OSS 等）
├─ controllers/      # 路由控制器（处理请求、返回响应）
├─ middlewares/      # 自定义中间件（认证、校验、错误处理）
├─ models/           # 数据模型（MongoDB 集合定义）
├─ routes/           # 路由定义（API 接口映射）
├─ services/         # 业务逻辑层（处理核心业务逻辑）
├─ socket/           # Socket.io 事件处理（实时通信）
├─ types/            # 类型定义（共享类型来自 shared-types）
├─ utils/            # 工具函数（加密、文件处理、错误处理）
└─ server.ts         # 服务入口文件
```

## 部署说明

1. 构建生产版本

```bash
pnpm build
```

2. 生产环境启动

```bash
pnpm start
```
