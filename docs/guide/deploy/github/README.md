---
title: 部署到 GitHub Pages
createTime: 2026/08/31 21:52:00
permalink: /guide/deploy/github/
---

GitHub Pages 可以免费托管站点并与代码仓库天然集成，但对 Shirone 来说**不是推荐选择**：

- 托管在 `*.github.io` 时必须配置 `base` 路径，所有内部链接都要以此为前缀，容易出错；
- 构建走 GitHub Actions，公共 runner 资源有限，Shirone 的多步构建（内容同步、字体子集、Pagefind 索引）耗时明显长于 Vercel / EdgeOne；
- 构建产物总量上限 1 GB，站点内容增长后容易触顶；
- 国内访问质量不佳。

如果仍选择 GitHub Pages（例如项目本身就在 GitHub 生态内），按以下步骤操作。

> [!IMPORTANT]
> **路径严格一致性准则**
> `base` 路径必须与 GitHub 仓库名（包括大小写）完全保持一致，前后必须包含斜杠（例如 `/my-blog/`）。

## 第一步：配置 site 与 base

编辑 `src/config/siteConfig.ts`：

**场景 A：部署到 `https://<username>.github.io`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io',
  base: '/',
  // ...
}
```

**场景 B：部署到 `https://<username>.github.io/<repo>`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io/<repo>',
  base: '/<repo>',
  // ...
}
```

::: warning base 的影响
配置 `base` 后，站点内所有链接、RSS、Sitemap、OG 图片都会带上该前缀。Shirone 的路由基于 `base` 生成，一般无需手动改文章链接，但**改动 base 后必须重新构建**，且浏览器旧缓存可能导致链接 404。
:::

## 第二步：创建 GitHub Actions 工作流

在 `.github/workflows/` 下新建 `deploy.yml`：

```yaml title=".github/workflows/deploy.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.14.4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

::: warning 关键参数
`node-version: 22` 和 `pnpm/action-setup` 不可省略——GitHub runner 默认的 Node 与 npm 环境无法满足 Shirone 的构建要求。
:::

## 第三步：启用 Pages

::: steps

1. 进入仓库 **Settings → Pages**。
2. **Source** 选择 **GitHub Actions**，保存。
3. 推送一次 `main`，在 **Actions** 标签页观察构建进度。

:::

完成后访问 `https://<username>.github.io/<repo>` 即可看到站点。

## 使用自定义域名（可选）

::: steps

1. 在仓库 **Settings → Pages → Custom domain** 填入你的域名。
2. 在域名服务商处添加 `CNAME` 记录指向 `<username>.github.io`。
3. 勾选 **Enforce HTTPS**。

:::

使用自定义域名（根域名或子域名）时，`base` 应改回 `/`，`site` 改为自定义域名。

## 常见问题

::: collapse
- 页面空白或资源 404
  九成是 `base` 配置与实际访问路径不匹配。确认 `siteConfig.ts` 中的 `base` 与仓库名（含大小写）完全一致，并清理构建缓存后重新部署。

- Actions 构建超时
  Shirone 构建步骤较多，免费 runner 偶尔超时。可在 workflow 中加入缓存（参考主题仓库 `deploy.yml.example` 的 `actions/cache` 配置，缓存 `.astro` 与缩略图目录）显著加速后续构建。

- 双仓模式怎么部署
  参考主题仓库的 `.github/workflows/deploy.yml.example`：内容仓推送后通过 `repository_dispatch` 通知主题仓重新构建，其变体 B 即 GitHub Pages 部署写法。
:::
