# 旧投稿后端（Cloudflare Sites / D1）

**状态：已停用，仅存档。** 地图上的投稿现已改为提交 GitHub Issue，维护者添加 `publish-approved` 标签后由工作流导入发布。本目录保留旧投稿服务的源码与部署脚手架，线上项目仍在，但不再接收新投稿。

相关说明见 [docs/hosting.md](../docs/hosting.md) 与 [docs/MAINTAINER.md](../docs/MAINTAINER.md)。`app/page.tsx` 会把访问者重定向到备用静态地图。

## 目录

| 路径 | 作用 |
| --- | --- |
| `app/` | 页面与 API 路由：`/api/submissions` 收投稿，`/api/catalog` 读作品，`/api/images/[id]`、`/api/posters/[id]` 取图，`/admin` 审核界面 |
| `app/chatgpt-auth.ts` | 平台注入的登录身份读取 |
| `db/` | Drizzle + D1：`schema.ts` 定义 `submissions` 表，`index.ts` 取绑定 |
| `drizzle/` | 已生成的迁移 SQL 与快照 |
| `lib/submission.ts` | 投稿校验与规范化 |
| `worker/index.ts` | 生产 Worker 入口，透传给 vinext 处理器 |
| `.openai/hosting.json` | 平台 D1 / R2 绑定声明 |
| `scripts/`、`vite.config.ts`、`worker/` | 平台提供的构建、发布与本地预览脚手架，**不要删** |

## 本地命令

需要 Node.js `>= 22.13.0`。

```sh
npm run install:ci   # 按 lockfile 安装依赖
npm run dev          # 本地开发预览（默认 5173）
npm run build        # 生成可部署产物到 dist/
npm run start        # 用 Wrangler 本地预览构建结果
npm run db:generate  # 修改 db/schema.ts 后生成迁移
```

本地状态目录 `.next/`、`.wrangler/`、`.sites-runtime/`、`dist/` 都已经在 `.gitignore` 中忽略。

## 注意

- 不要把 `../assets/`、`../data/` 或本目录当作临时文件删除。
- 已停用，所以没有 CI 覆盖；改动前请先确认对应 Sites 项目是否还需要发布。
