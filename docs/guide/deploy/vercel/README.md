---
title: 部署到 Vercel
createTime: 2026/08/31 21:50:00
permalink: /guide/deploy/vercel/
---

Vercel 的配置项较少：推送 Git 后自动构建，提供全球边缘网络和预览部署，个人博客的免费额度通常够用。

## 前置条件

- 代码已托管在 GitHub / GitLab / Bitbucket
- 已将 `site` 设置为你的正式域名（如 `https://your-domain.com`），`base` 保持 `/`。单仓改 `src/config/siteConfig.ts`；双仓改内容仓的 `config/site.yaml`

::: tip 单仓 vs 双仓
单仓模式（内容直接写在主题仓 `src/content/`）按本文操作即可。双仓模式（Shirone-Content）需额外在 Vercel 环境变量中配置：

- `CONTENT_REPO_URL`：私有仓使用 `https://x-access-token:<TOKEN>@github.com/...` 形式
- `CONTENT_REPO_REF`：需要固定分支/标签时设置，默认 `main`
- `GIT_TERMINAL_PROMPT`：`0`，避免构建机卡在账号密码提示

`pnpm build` 已包含 `content:sync`，构建命令保持 `pnpm build` 即可，不需要再写 `pnpm content:sync &&`。
:::

## 方式一：Git 集成部署（推荐）

::: steps

1. 访问 [vercel.com/new](https://vercel.com/new)，导入你的 Shirone 仓库。

2. Vercel 会自动识别 Astro 项目并预填构建配置。确认以下设置：

   | 配置项 | 值 |
   | --- | --- |
   | Framework Preset | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

3. 在 **Settings** -> **General** -> **Node.js Version** 选择 `26.x`。Vercel **不读取** `NODE_VERSION` 环境变量；它根据项目设置或 `package.json` 的 `engines.node` 选择 Node 版本。本仓库的 `engines.node` 已要求 `>=26.13.0`，正常情况下会自动使用 Node 26。

4. 点击 **Deploy**。首次构建约 2-5 分钟，完成后你会得到一个 `*.vercel.app` 域名。

:::

此后每次推送到生产分支（`main`）都会触发生产部署，推送到其他分支则生成预览部署（Preview Deployment），可在合并前检查文章渲染效果。

## 方式二：CLI 部署

适合不想授权 Git 集成、或需要从本地直接交付构建产物的场景：

```bash
pnpm add -g vercel

vercel          # 首次运行，按提示登录并关联项目
vercel --prod   # 部署到生产环境
```

CLI 会自动检测 Astro 配置。当被询问 `Want to override the settings? [y/N]` 时选择 `N`。

::: warning 注意
CLI 直接上传的是源码仓，Vercel 仍会在云端执行构建。如果你只想交付本地构建好的 `dist/`，参考 [本地构建](/guide/deploy/local/) 页面的做法。
:::

## 自定义域名

1. 进入项目的 **Settings → Domains**，添加你的域名。
2. 按提示在域名服务商处添加 `A` 记录（指向 `76.76.21.21`）或 `CNAME` 记录（指向 `cname.vercel-dns.com`）。
3. DNS 生效后 Vercel 自动签发 SSL 证书。

## 通过 vercel.json 定制行为

仓库根目录已内置 `vercel.json`，可用于覆盖默认行为，例如为静态资源附加缓存头：

```json title="vercel.json"
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## 常见问题

::: collapse
- 构建失败：Node 版本过低

  日志中出现 `Unsupported engine` 或语法错误时，到 **Settings** -> **General** -> **Node.js Version** 确认已选 `26.x`，并检查 `package.json` 的 `engines.node` 是否被改过。设置 `NODE_VERSION` 环境变量对 Vercel 无效。

- 构建超时

  Shirone 构建包含内容同步、图标生成、缩略图、字体子集化与 Pagefind 索引等多个步骤。若频繁超时，可在 Vercel 项目设置中开启构建缓存，或参考主题仓库的 `deploy.yml.example` 改用 GitHub Actions 构建后通过 `vercel deploy dist --prod` 仅交付产物。

- 搜索不可用

  Pagefind 索引在 `pnpm build` 末尾生成于 `dist/pagefind/`。若搜索失效，检查部署的产物中是否包含该目录——使用自定义 CI 时最容易遗漏这一步。
:::
