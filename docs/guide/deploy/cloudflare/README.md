---
title: 部署到 Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /guide/deploy/cloudflare/
---

Cloudflare Pages 提供全球 CDN、免费 SSL 与不限请求数的静态资源分发，是个人博客性价比很高的选择。

## 前置条件

- 代码已托管在 GitHub / GitLab
- 注册 [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费计划即可）
- `src/config/siteConfig.ts` 中的 `site` 已设置为正式域名

> [!IMPORTANT]
> **Node.js 环境变量设置**
> Cloudflare Pages 默认构建镜像的 Node 版本较旧。必须在环境变量中添加 `NODE_VERSION = 22`，以满足 Node.js ≥ 22.12 的运行要求。

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

4. 展开 **Environment variables**，添加 `NODE_VERSION = 22`（满足 Node.js ≥ 22.12 的要求）。

   **务必添加此变量：** Cloudflare 构建镜像默认的 Node 版本低于 22，缺少此变量时构建必然失败。

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
  未设置 `NODE_VERSION=22` 环境变量，或使用了 `npm install` 而非 pnpm。确认构建命令为 `pnpm build`，并启用 corepack（`corepack enable && pnpm build`）以对齐仓库锁定的 pnpm 版本。

- 国内访问速度
  Cloudflare 对中国大陆的回源与 Anycast 路由表现不稳定，未备案域名走海外节点延迟波动较大。读者主要在国内时可对比 [EdgeOne Pages](/guide/deploy/edgeone/)。

- 500 次构建额度
  免费计划每月 500 次构建。频繁改动时注意 Actions / CI 与 Pages 会各计一次构建；纯内容更新建议合并提交，或改用 Wrangler CLI 按需部署（CLI 上传不消耗构建额度）。
:::
