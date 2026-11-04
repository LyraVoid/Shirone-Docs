---
title: 部署到 Netlify
createTime: 2026/08/31 21:51:00
permalink: /guide/deploy/netlify/
---

本文介绍 Netlify 平台的具体设置。构建位置选择与平台构建命令的开关说明，详见[部署总览](/guide/deploy/overview/)。

## 前置条件

- 代码已推送到 GitHub、GitLab、Bitbucket 或 Azure DevOps 仓库；
- `site` 已设置为正式域名。单仓修改 `src/config/siteConfig.ts`，双仓修改内容仓的 `config/site.yaml`。

双仓模式需在平台环境变量中声明 `CONTENT_REPO_URL`（私有仓需携带访问令牌）、可选的 `CONTENT_REPO_REF`，以及 `GIT_TERMINAL_PROMPT=0`。各变量定义详见[内容源配置](/guide/content-separation/content-sources/)。

## 方式一：控制台导入

::: steps

1. **导入项目**

   登录 [Netlify 控制台](https://app.netlify.com/)，依次点击 **Add a new site** -> **Import an existing project**。

2. **选择代码仓库**

   选择 Git 托管提供商并完成授权，选中 Shirone 仓库。

3. **确认构建配置**

   核对以下构建参数：

   | 配置项 | 设定值 |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `dist` |

4. **添加环境变量**

   在 **Environment variables** 中添加 `NODE_VERSION = 26`。双仓模式需在此补充上述三个内容源环境变量。

5. **执行部署**

   点击 **Deploy** 按钮启动首次构建。

:::

## 方式二：netlify.toml

将构建参数显式固化在仓库根目录下的配置文件中，避免强依赖控制台界面手动设置：

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "26"
```

提交并推送到代码仓后，Netlify 会自动读取该文件并应用对应的构建规则。

## 方式三：CLI

```bash
pnpm add -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

`netlify init` 会自动关联线上站点并配置部署公钥，之后执行 `git push` 即可触发平台自动构建。

::: tip 已经构建好 dist 时
`--build` 参数会命令 Netlify CLI 在本地重新执行一次完整构建。若本地已预先执行过 `pnpm build`，直接分发已有产物更为高效：

```bash
netlify deploy --prod --dir=dist
```

上传的产物目录中必须完整包含 `dist/pagefind/` 文件夹。
:::

## 预览部署

导入项目后，推送到非主分支或针对仓库创建 Pull Request 均会自动生成独立的预览站点。可在将文章合并到 `main` 分支前，通过预览链接检查图文排版效果。

## 自定义域名

1. 进入项目设置，依次点击 **Site settings** -> **Domain management** -> **Add a domain**，输入目标域名；
2. 按照页面提示在域名服务商处添加对应的 DNS 解析记录；
3. SSL 证书将由 Let's Encrypt 自动签发并定期续期。

## 常见问题

::: collapse
- 构建失败：pnpm 版本不匹配

  `NODE_VERSION` 仅指定 Node.js 版本。Netlify 默认优先读取 `package.json` 中的 `packageManager`（当前仓库锁定为 `pnpm@11.28.2`）。若版本依然不符，可将构建命令调整为：

  ```toml
  [build]
    command = "npm i -g pnpm@11.28.2 && pnpm build"
    publish = "dist"
  ```

- 构建失败：找不到 `corepack` 命令

  Node.js 26 不再内置 corepack。若需使用 corepack，可在构建命令前手动执行 `npm i -g corepack && corepack enable`，或直接通过 npm 全局安装 pnpm。

- 单次部署文件数超出平台上限

  Netlify 对单次部署的文件总数与站点总大小设有上限。请核查 `public/` 目录下是否误放了未压缩的大体积原始图片。

- 中国大陆访问质量不稳定

  Netlify 的边缘 CDN 在中国大陆的网络延迟存在波动。若博客读者主要位于国内，建议对比评估 [EdgeOne Pages](/guide/deploy/edgeone/)。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：对比其他托管平台
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：使用 GitHub Actions 构建并交付
