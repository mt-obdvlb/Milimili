# CI/CD Setup

这个仓库现在包含两条 GitHub Actions：

- `CI`
  - 在 `pull_request` 和 `main` 分支 `push` 时执行
  - 安装依赖并构建 `shared-types`、`server`、`web`
- `Deploy`
  - 在 `CI` 成功后执行
  - 通过 SSH 把构建产物上传到服务器
  - 只更新并重启 `milimili-app`
  - 不会重建 `milimili-mongo`

## 需要配置的 GitHub Secrets

- `DEPLOY_HOST`
  - 服务器地址
  - 当前可以填 `47.97.47.50`
- `DEPLOY_USER`
  - SSH 用户
  - 当前可以填 `root`
- `DEPLOY_SSH_KEY`
  - 用于部署的私钥内容
  - 建议单独创建一把 GitHub Actions 专用 key
- `DEPLOY_PATH`
  - 服务器上的 CI/CD 工作目录
  - 建议填 `/root/milimili-cicd`
- `DEPLOY_APP_CONTAINER`
  - 应用容器名
  - 当前可以填 `milimili-app`

## 服务器前置要求

服务器需要满足：

- 已安装 Docker
- `milimili-app` 容器已经存在并可正常运行
- MongoDB 容器继续沿用现有的 `milimili-mongo` 数据卷
- 部署用户有权限执行 `docker exec`、`docker cp`、`docker restart`

## 首次接入建议

1. 在本地生成一把专用 SSH key。
2. 把公钥追加到服务器 `~/.ssh/authorized_keys`。
3. 把私钥内容保存到 GitHub Secret `DEPLOY_SSH_KEY`。
4. 在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 中补齐其余 secrets。
5. 推送到 `main`，先观察 `CI` 成功，再观察 `Deploy` 自动接续执行。

## 当前部署策略

这套 CD 不是在服务器重新构建 Docker 镜像，而是：

- GitHub Actions 先完成构建
- 上传 `apps/server/dist` 和 `apps/web/.next`
- 覆盖进正在运行的 `milimili-app`
- 重启 `milimili-app`

这个策略更适合你现在的线上环境，因为它不会触碰 MongoDB，也不依赖服务器去拉新的基础镜像。
