---
title: 部署总览
createTime: 2026/11/03 10:00:00
permalink: /guide/deploy/overview/
---

Shirone 构建后是纯静态站点，产物统一在 `dist/`。部署方式的区别只在于：**谁执行构建**、**谁托管产物**、**内容仓更新后如何触发重建**。

## 先确定两件事

### 1. 单仓还是双仓

| 模式 | 内容位置 | 站点配置 | 适合谁 |
| --- | --- | --- | --- |
| 单仓 | 主题仓 `src/content/` | `src/config/siteConfig.ts` | 内容公开、想少配一套仓库 |
| 双仓 | 独立内容仓的 `content/`、`data/`、`assets/`、`public/` | 优先用内容仓的 `config/site.yaml` | 内容私有、希望主题升级与写作互不干扰 |

双仓构建时，`content:sync` 会根据 `CONTENT_DIR`、`CONTENT_REPO_URL` 或 `shirone.content.json` 找到内容源。`pnpm build` 已经包含这一步，平台构建命令保持 `pnpm build` 即可。

### 2. 构建放在哪里

| 方式 | 构建位置 | 优点 | 注意 |
| --- | --- | --- | --- |
| 平台 Git 集成 | 平台构建机 | 配置最少，推送即构建 | 受平台 Node/pnpm 版本与构建额度限制 |
| GitHub Actions + 平台 Hook | GitHub runner | 版本可控，可先校验内容 | 多一层派发配置 |
| 本地构建 | 自己的机器 | 产物完全可控，可离线 | 需要手动上传 |
| Docker | 本地或 CI | 环境隔离，可回滚 | 镜像需安装正确 pnpm，且不能漏掉 `scripts/` |

## 平台选择

| 平台 | Node 版本 | 构建命令 | 输出 | 备注 |
| --- | --- | --- | --- | --- |
| [Vercel](/guide/deploy/vercel/) | 项目设置选 `26.x` | `pnpm build` | `dist` | 不读取 `NODE_VERSION` 环境变量 |
| [Netlify](/guide/deploy/netlify/) | `NODE_VERSION=26` | `pnpm build` | `dist` | pnpm 由 `packageManager`/mise 决定 |
| [Cloudflare Pages](/guide/deploy/cloudflare/) | `NODE_VERSION=26` | `pnpm build` | `dist` | 另设 `PNPM_VERSION=11.28.2`；必须是 Pages 不是 Worker |
| [EdgeOne Pages](/guide/deploy/edgeone/) | `24` | `pnpm build` | `dist` | 当前最高可选 24，Node 24 可正常构建 |
| [GitHub Pages](/guide/deploy/github/) | `26.13.0` | `pnpm build` | `dist` | 子路径部署必须配 `base` |
| [服务器](/guide/deploy/server/) | 不限制 | `pnpm build` | `dist` | Nginx 托管，HTML 不缓存 |
| [Docker](/guide/deploy/docker/) | 镜像内 `node:26-alpine` | `pnpm build` | `dist` | 不要从 `.dockerignore` 排除 `scripts/` |
| [本地构建](/guide/deploy/local/) | `26.13.0` | `pnpm build` | `dist` | 其他方式的底层原语 |

> Node.js 26 不再内置 corepack。需要手动装 pnpm 时统一用 `npm install -g pnpm@11.28.2`，不要在 Node 26 上只写 `corepack enable`。

## 双仓更新链路

推荐链路是「内容仓校验 → 派发 → 主题仓构建」：

1. 内容仓推送 `content/`、`config/`、`data/`、`assets/`、`public/` 等目录；
2. 内容仓的 `trigger-build.yml` 调用 `content-validate.yml` 校验；
3. 校验通过后发 `repository_dispatch`，事件名 `content-updated`，payload 带 `sha`；
4. 主题仓的 `deploy.yml` 按该 SHA 拉取内容仓，执行 `pnpm build`；
5. 按所选变体发布到 Vercel、GitHub Pages、服务器或平台 Deploy Hook。

完整文件直接使用主题仓的 `.github/workflows/deploy.yml.example` 和内容仓的 `.github/workflows/trigger-build.yml.example`，不要手写简化版。详见 [跨仓自动化构建与发布](/guide/content-separation/ci-dispatch/)。

如果让平台自己构建，则用 [Deploy Hook](/guide/content-separation/deploy-hooks/)：内容仓 POST 平台 Hook，平台拉主题仓并构建。Hook 方式通常构建分支 HEAD，不保证精确到触发它的那个 commit；需要严格按 SHA 构建时用 Actions 派发。

## 部署前检查清单

- [ ] `site` 是正式域名，`base` 与实际访问路径一致
- [ ] 构建命令是 `pnpm build`，不是 `astro build`
- [ ] 输出目录是 `dist`，且包含 `dist/pagefind/`
- [ ] 平台 Node 版本满足要求；EdgeOne 选 24，其余选 26
- [ ] pnpm 版本与 `pnpm@11.28.2` 一致
- [ ] 双仓已配置 `CONTENT_REPO_URL`、`CONTENT_REPO_REF`、`GIT_TERMINAL_PROMPT=0`
- [ ] 私有内容仓的 Token 放在**主题仓**，派发用的 `DISPATCH_TOKEN` 放在**内容仓**
