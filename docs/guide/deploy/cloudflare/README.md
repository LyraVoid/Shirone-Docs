---
title: 部署到 Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /guide/deploy/cloudflare/
---

Cloudflare Pages 提供全球 CDN、免费 SSL 与不限请求数的静态资源分发，是个人博客性价比很高的选择。

## 前置条件

- 代码已托管在 GitHub / GitLab
- 注册 [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费计划即可）
- 站点配置中的 `site` 已设置为正式域名（单仓改 `src/config/siteConfig.ts`，双仓改内容仓的 `config/site.yaml`）

> [!IMPORTANT]
> **Node.js 环境变量设置**
> Cloudflare Pages 默认构建镜像的 Node 版本较旧。必须在环境变量中添加 `NODE_VERSION = 26`，以满足 Node.js ≥ 26.13.0（Node.js 26 LTS）的运行要求。

## 方式一：Git 集成部署

::: steps

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages → Create → Pages → Connect to Git**。

2. 选择 Git 提供商并授权，选中你的 Shirone 仓库。

3. 配置构建设置：

   | 配置项 | 值 |
   | --- | --- |
   | Project name | 自定义（决定默认域名 `<name>.pages.dev`） |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |

4. 展开 **Environment variables**，添加：

   | 变量 | 值 | 说明 |
   | --- | --- | --- |
   | `NODE_VERSION` | `26` | Cloudflare 构建镜像默认 Node 版本低于 26，必须显式指定 |
   | `PNPM_VERSION` | `11.28.2` | 与仓库 `packageManager` 一致，避免 pnpm 版本过旧 |
   | `GIT_TERMINAL_PROMPT` | `0` | 双仓拉取私有内容仓时禁用交互式账号密码提示 |

   双仓模式还需要添加 `CONTENT_REPO_URL`（私有仓使用 `https://x-access-token:<TOKEN>@github.com/...` 形式），需要固定分支时设置 `CONTENT_REPO_REF=main`。

5. 点击 **Save and Deploy**，首次构建约 3-6 分钟。

:::

此后推送 `main` 触发生产部署，推送其他分支自动生成预览部署（`<hash>.<name>.pages.dev`）。

## 方式二：Wrangler CLI 直接部署

适合本地构建后交付产物，无需授权 Git 仓库：

```bash
pnpm add -g wrangler

wrangler login
pnpm build
wrangler pages deploy dist --project-name=shirone-blog
```

::: tip
CLI 部署跳过了平台构建环节，本地执行 `pnpm build` 时 Pagefind 索引与字体子集化都已包含在产物中，上传即可获得完整功能。
:::

## 自定义域名

::: steps

1. 进入项目 **Custom domains → Set up a custom domain**，输入域名。
2. 若域名已托管在同一 Cloudflare 账号，DNS 记录自动添加；否则按提示去域名服务商添加 `CNAME` 记录指向 `<name>.pages.dev`。
3. SSL 证书自动签发，通常数分钟内生效。

:::

## 缓存策略

Cloudflare 默认策略对静态站点已足够合理：HTML 短缓存、指纹化资源长缓存。如需精细控制，在 `public/` 下添加 `_headers` 文件：

```ini title="public/_headers"
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400
```

## 常见问题

::: collapse
- 构建失败：`Unsupported engine` 或语法错误

  未设置 `NODE_VERSION=26` 环境变量，或使用了 `npm install` 而非 pnpm。确认构建命令为 `pnpm build`，并设置 `PNPM_VERSION=11.28.2`。Node.js 26 已不再内置 corepack，不要用 `corepack enable` 替代；确实需要手动安装时用 `npm i -g pnpm@11.28.2`。

- 构建失败：`__dirname is not defined`

  项目创建成了 **Worker** 而不是 **Pages**。Cloudflare Workers 没有 Node.js 的 `__dirname`，Shirone 的构建脚本会直接报错。请删除该 Worker 项目，重新创建 **Pages** 项目并连接 Git；不要选择 Worker 模板或使用 `wrangler deploy`。

- 双仓模式（Shirone-Content）

  在 Pages 环境变量中配置 `CONTENT_REPO_URL`、`CONTENT_REPO_REF`、`GIT_TERMINAL_PROMPT=0`。`pnpm build` 已经包含 `content:sync`，构建命令保持 `pnpm build` 即可，不要再叠加 `pnpm content:sync &&`。站点配置优先放在内容仓的 `config/site.yaml`。

- 国内访问速度

  Cloudflare 对中国大陆的回源与 Anycast 路由表现不稳定，未备案域名走海外节点延迟波动较大。读者主要在国内时可对比 [EdgeOne Pages](/guide/deploy/edgeone/)。

- 500 次构建额度

  免费计划每月 500 次构建。频繁改动时注意 Actions / CI 与 Pages 会各计一次构建；纯内容更新建议合并提交，或改用 Wrangler CLI 按需部署（CLI 上传不消耗构建额度）。
:::
