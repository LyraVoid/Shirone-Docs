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

## 先选构建位置

Vercel 有两种接法，选一种即可：

| 方式 | 谁执行构建 | 内容仓如何触发 | Vercel 侧配置 |
| --- | --- | --- | --- |
| Git 集成 / Deploy Hook | Vercel 构建机 | 内容仓 POST `VERCEL_DEPLOY_HOOK` | 配置 `CONTENT_REPO_URL`、`CONTENT_REPO_REF`、`GIT_TERMINAL_PROMPT` |
| GitHub Actions | 主题仓 Actions | `repository_dispatch` 事件 | 关闭 Vercel 的 Git 自动构建，由 Actions 执行 `vercel deploy dist --prod` |

两种都保留会重复部署。用 Deploy Hook 时，Vercel 构建的是内容仓分支的最新 HEAD；需要精确按某次提交构建时，用 GitHub Actions 模式。

::: warning 选 GitHub Actions 模式时，必须清空 Vercel 的构建命令
Actions 或 CLI 模式上传的是本地已经打好的 `dist/` 纯静态产物（里面没有源码和 `package.json`）。如果你的 Vercel 项目之前连过 Git，项目设置里还残留着 Framework Preset（`Astro`）和 Build Command（`pnpm build`），Vercel 就会对上传上来的静态文件再跑一次构建，直接报错：

```text
Error: Command "pnpm build" exited with 1
```

**光断开 Git 连接是不够的**：Build Command 默认保存在项目设置里，即使断开 Git 也依然会触发。请务必前往 **Settings -> Build & Output Settings** 修改：

| 配置项 | 值 | 说明 |
| --- | --- | --- |
| Framework Preset | `Other` | 取消识别为 Astro 项目 |
| Build Command | 清空并关闭 Override 开关 | 不执行任何云端构建 |
| Output Directory | 清空并关闭 Override 开关 | 直接把上传的目录作为站点根目录 |

改完后重新跑一次 Actions 部署。只要 Vercel 部署日志里不再出现 `Running "vercel build"`，就说明配置成功了。
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

3. 展开 **Environment Variables**，可以直接在导入页面添加变量。双仓模式至少填写 `CONTENT_REPO_URL`；需要固定分支时再填 `CONTENT_REPO_REF`，并设置 `GIT_TERMINAL_PROMPT=0`。也可以点 **Import .env** 导入本地 `.env` 文件，或在部署完成后到 **Deployments** -> **Environments** 补填。

   | Key | Value |
   | --- | --- |
   | `CONTENT_REPO_URL` | `https://x-access-token:<TOKEN>@github.com/<OWNER>/<CONTENT_REPO>.git` |
   | `CONTENT_REPO_REF` | `main`（可选） |
   | `GIT_TERMINAL_PROMPT` | `0` |

   ![在 Vercel 导入页面填写环境变量](/images/deploy/vercel/01-import-environment.png)

4. Node.js 版本不在导入表单里。项目创建后进入 **Settings** -> **General** -> **Node.js Version** 选择 `26.x`。Vercel **不读取** `NODE_VERSION` 环境变量；它根据项目设置或 `package.json` 的 `engines.node` 选择 Node 版本。本仓库的 `engines.node` 已要求 `>=26.13.0`，正常情况下会自动使用 Node 26。

5. 点击 **Deploy**。首次构建约 2-5 分钟，完成后你会得到一个 `*.vercel.app` 域名。

   ![Vercel 部署完成后的项目概览](/images/deploy/vercel/02-project-overview.png)

:::

此后每次推送到生产分支（`main`）都会触发生产部署，推送到其他分支则生成预览部署（Preview Deployment），可在合并前检查文章渲染效果。

## 部署后修改环境变量

如果导入时漏了变量，或者部署后需要更换 Token，在项目左侧进入 **Deployments** -> **Environments**，选择要修改的环境（Production、Preview 或 Development），补充或修改变量。保存后重新部署一次，让新变量进入构建环境。

![Vercel Deployments 下的 Environments](/images/deploy/vercel/03-environments.png)

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

::: warning 交付 dist 前先确认 Vercel 已关闭构建
使用 `vercel deploy dist --prod` 上传产物前，确认该项目已经按上文提示改好：Framework Preset 改为 `Other`、清空 Build Command，并关闭 Git 自动构建。很多部署失败都是因为项目设置里还留着 `pnpm build`，导致云端对纯静态产物再次执行构建。
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
