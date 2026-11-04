---
title: 部署到 GitHub Pages
createTime: 2026/08/31 21:52:00
permalink: /guide/deploy/github/
---

本文介绍 GitHub Pages 平台的具体设置。构建位置选择与平台构建命令的开关说明，详见[部署总览](/guide/deploy/overview/)。

GitHub Pages 支持免费托管静态站点，但部署 Shirone 时存在以下限制：

- 部署至 `*.github.io/<repo>` 子路径时必须配置 `base`，所有站内链接均会自动带上前缀；
- 构建依托 GitHub Actions 执行，公共 Runner 运行耗时明显长于 Vercel 或 EdgeOne；
- 部署产物存在 1 GB 的总体积上限；
- 中国大陆网络环境下的访问质量存在波动。

若项目本身已存放在 GitHub 平台，依然可以通过 GitHub Pages 完成发布。

## 第一步：配置 site 与 base

编辑 `src/config/siteConfig.ts`。双仓模式下需修改内容仓中的 `config/site.yaml`。

**部署至根域名 `https://<username>.github.io`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io',
  base: '/',
}
```

**部署至仓库子路径 `https://<username>.github.io/<repo>`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io/<repo>',
  base: '/<repo>',
}
```

`base` 参数必须与 GitHub 仓库名严格保持一致（区分英文字母大小写），且首尾均需保留正斜杠。

> 修改 `base` 参数后必须重新执行构建。该参数直接影响站内链接、RSS 订阅源、Sitemap 索引以及社媒分享图片的生成路径。

## 第二步：创建工作流

在仓库根目录下新建 `.github/workflows/deploy.yml`：

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
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 11.28.2

      - uses: actions/setup-node@v4
        with:
          node-version: 26
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`node-version: 26` 与 `pnpm/action-setup` 步骤均不可省略，GitHub Actions Runner 默认的 Node.js 版本不符合主题最低要求。

## 第三步：启用 Pages

1. 进入 GitHub 仓库设置，点击 **Settings** -> **Pages**；
2. 在 **Build and deployment** 下将 **Source** 切换为 **GitHub Actions**；
3. 推送一次代码至 `main` 分支，在仓库 **Actions** 标签页确认工作流执行成功。

构建完成后即可访问 `https://<username>.github.io/<repo>`。

## 自定义域名

1. 在仓库 **Settings** -> **Pages** -> **Custom domain** 中填入个人域名并保存；
2. 在域名服务商处添加一条 `CNAME` 解析记录，指向 `<username>.github.io`；
3. 勾选 **Enforce HTTPS** 启用安全连接；
4. 将配置文件中的 `base` 改回 `/`，并将 `site` 更新为绑定的自定义域名。

## 双仓模式

内容仓推送更新后，由内容仓工作流向主题仓发送派发事件，主题仓按 commit SHA 拉取内容后再行构建。完整配置流程见[跨仓自动构建](/guide/content-separation/ci-dispatch/)，部署步骤请直接参考 `deploy.yml.example` 中的变体 B。

所需配置的仓库密钥：

- 内容仓密钥：`DISPATCH_TOKEN`；
- 主题仓密钥：`CONTENT_REPO_TOKEN`。

## 常见问题

::: collapse
- 访问页面空白或静态资源报 404

  `base` 参数与实际部署路径不符。请核查 `base` 是否与仓库名称完全一致，清理构建缓存后重新部署。

- Actions 构建频繁超时

  Shirone 构建流水线包含较多优化步骤。可参考 `deploy.yml.example` 中的 `actions/cache` 配置项，为缩略图与静态缓存添加持久化存储以提升后续构建速度。

- 全文搜索功能不可用

  核对部署生成的产物目录中是否包含完整的 `dist/pagefind/` 文件夹，并确认 `actions/upload-pages-artifact` 上传的是包含全部子文件的整个 `dist` 目录。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：对比其他托管平台
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：配置双仓自动发布流程
