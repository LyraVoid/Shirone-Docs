---
title: 部署总览
createTime: 2026/11/03 10:00:00
permalink: /guide/deploy/overview/
---

Shirone 经构建后输出为纯静态站点，生成物位于 `dist/`。选择部署方案时通常需确定两项核心决策：**由谁执行构建任务**，以及**内容仓更新后如何触发站点重新构建**。

## 第一步：决定构建位置

| 方案 | 构建执行方 | 主要优势 | 注意事项 |
| --- | --- | --- | --- |
| 平台 Git 集成 | 托管平台构建机 | 配置门槛最低，代码推送即自动构建 | 受平台 Node、pnpm 版本支持与每月构建时长配额限制 |
| 平台 Deploy Hook | 托管平台构建机 | 内容仓可独立发起触发请求 | 构建拉取目标分支最新 commit，不保证对应单次特定推送 |
| GitHub Actions | GitHub Actions Runner | 运行环境与版本高度可控，可精准指定 commit SHA | 需配置跨仓事件派发密钥与访问令牌 |
| 本地构建 | 本地开发机 | 构建产物完全可控，支持离线构建 | 需手动或编写脚本分发产物 |
| Docker | 本地机或 CI 容器 | 环境完全隔离一致，便于版本回滚 | 镜像需安装对应 pnpm 版本，且必须包含 `scripts/` 目录 |

## 第二步：平台设置与构建位置配套

配置冲突是部署失败最常见的诱因，核心在于构建执行方与平台预设不匹配。

**托管平台自行执行构建**（Git 集成、Deploy Hook、Docker 镜像内构建）：

- 平台控制台保持构建命令为 `pnpm build`，输出目录为 `dist`；
- 双仓模式下在平台环境变量中配置 `CONTENT_REPO_URL`、`CONTENT_REPO_REF` 与 `GIT_TERMINAL_PROMPT=0`；
- 无需在构建命令前额外添加 `pnpm content:sync`，`pnpm build` 内部已包含同步逻辑。

**由 Actions 或本地构建后交付 `dist/`**：

- 托管平台仅承担静态资源托管职责，必须关闭平台的自动构建；
- 在平台设置中将 Framework Preset 修改为 `Other`，清空 Build Command 与 Output Directory，并关闭 Git 自动触发；
- 上传的 `dist/` 产物中不含 `package.json`，若平台重复执行构建将报错 `Error: Command "pnpm build" exited with 1`。

上述两套模式只能二选一。切换模式后请重新触发一次部署以使设置生效。

## 平台对照表

下表给出的参数适用于“托管平台自行构建”场景。若由 Actions 或本地直接上传产物，请按上一节说明关闭平台构建。

| 托管平台 | Node.js 版本要求 | 构建命令 | 输出目录 | 平台特性备注 |
| --- | --- | --- | --- | --- |
| [Vercel](/guide/deploy/vercel/) | 项目设置中选 `26.x` | `pnpm build` | `dist` | 忽略 `NODE_VERSION` 环境变量 |
| [Netlify](/guide/deploy/netlify/) | 环境变量 `NODE_VERSION=26` | `pnpm build` | `dist` | pnpm 版本由 `package.json` 的 `packageManager` 确定 |
| [Cloudflare Pages](/guide/deploy/cloudflare/) | 环境变量 `NODE_VERSION=26` | `pnpm build` | `dist` | 需额外配置 `PNPM_VERSION=11.28.2`；项目类型必须为 Pages |
| [EdgeOne Pages](/guide/deploy/edgeone/) | 控制台版本选 `24` | `pnpm build` | `dist` | 腾讯云边缘托管，当前最高支持 Node 24 |
| [GitHub Pages](/guide/deploy/github/) | Actions 声明 `26.13.0` | `pnpm build` | `dist` | 部署至仓库子路径时必须在配置中指定 `base` |
| [服务器](/guide/deploy/server/) | 宿主机无限制 | `pnpm build` | `dist` | Nginx 静态托管，建议 HTML 设置为禁止缓存 |
| [Docker](/guide/deploy/docker/) | 镜像采用 `node:26-alpine` | `pnpm build` | `dist` | `.dockerignore` 切勿排除 `scripts/` 目录 |
| [本地构建](/guide/deploy/local/) | 本地使用 `26.13.0` | `pnpm build` | `dist` | 作为所有其他交付方式的基础底座 |

Node.js 26 不再内置 corepack。需要手动安装 pnpm 时，统一执行 `npm install -g pnpm@11.28.2`。

## 双仓模式的内容从哪来

双仓模式下有两种内容同步对接方式：

- **平台自行构建**：平台利用 `CONTENT_REPO_URL` 远程拉取内容仓，变量配置见[内容源配置](/guide/content-separation/content-sources/#三种常见场景)；
- **GitHub Actions 构建**：内容仓推送触发事件，主题仓将内容仓检出至 `.content-src/` 后执行构建，详见[跨仓自动构建](/guide/content-separation/ci-dispatch/)。

内容仓更新后促使平台重新拉取构建的设置流程，请参阅[部署钩子](/guide/content-separation/deploy-hooks/)。

## 上线前检查清单

- [ ] `site` 已设置为正式域名，`base` 与实际访问路径完全一致
- [ ] 构建命令显式指定为 `pnpm build`，而非 `astro build` 或 `npm run build`
- [ ] 输出目录指定为 `dist`，产物中包含完整的 `dist/pagefind/` 目录
- [ ] 平台 Node.js 版本满足规范（EdgeOne 选 24，其余平台选 26）
- [ ] 由 Actions 或本地交付产物时，已在平台侧关闭自带构建与清空构建命令
- [ ] 双仓模式下已配置 `CONTENT_REPO_URL`、`CONTENT_REPO_REF` 与 `GIT_TERMINAL_PROMPT=0`
- [ ] `DISPATCH_TOKEN` 已存入内容仓，`CONTENT_REPO_TOKEN` 已存入主题仓

## 下一步

选择具体部署平台：

- [Vercel](/guide/deploy/vercel/)
- [Cloudflare Pages](/guide/deploy/cloudflare/)
- [EdgeOne Pages](/guide/deploy/edgeone/)
- [Netlify](/guide/deploy/netlify/)
- [GitHub Pages](/guide/deploy/github/)
- [服务器](/guide/deploy/server/)
- [Docker](/guide/deploy/docker/)
- [本地构建](/guide/deploy/local/)
