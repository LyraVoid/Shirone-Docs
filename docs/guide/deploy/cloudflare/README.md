---
title: 部署到 Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /guide/deploy/cloudflare/
---

本文介绍 Cloudflare Pages 平台的具体设置。构建位置选择与平台构建命令的开关说明，详见[部署总览](/guide/deploy/overview/)。

## 前置条件

- 代码已推送到 GitHub 或 GitLab 仓库；
- 拥有 Cloudflare 账号，免费套餐即可满足需求；
- `site` 已设置为正式域名。单仓修改 `src/config/siteConfig.ts`，双仓修改内容仓的 `config/site.yaml`。

> 必须创建 **Pages** 项目，切勿创建为 Worker。若选错项目类型，构建时将报错 `__dirname is not defined`。

## 方式一：Git 集成

::: steps

1. **创建 Pages 项目**

   登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，依次进入 **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**。

2. **选择代码仓库**

   选择 Git 托管提供商并完成授权，选中 Shirone 仓库。

3. **配置构建参数**

   核对并填写以下构建配置：

   | 配置项 | 设定值 |
   | --- | --- |
   | Project name | 自定义项目名，决定默认分配的 `<name>.pages.dev` 域名 |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |

4. **配置环境变量**

   展开环境变量配置区域，添加以下键值：

   | 变量名 | 设定值 | 说明 |
   | --- | --- | --- |
   | `NODE_VERSION` | `26` | 默认构建镜像预装的 Node 版本低于 26 |
   | `PNPM_VERSION` | `11.28.2` | 与 `package.json` 中的 `packageManager` 锁定版本一致 |
   | `GIT_TERMINAL_PROMPT` | `0` | 克隆私有内容仓时禁止交互式提示挂起构建 |

   双仓模式还需配置 `CONTENT_REPO_URL`，需要固定分支时添加 `CONTENT_REPO_REF`。配置规范详见[内容源配置](/guide/content-separation/content-sources/)。

5. **执行首次部署**

   点击 **Save and Deploy**，首次构建耗时约 3 至 6 分钟。

:::

部署完成后，后续推送到 `main` 分支会自动触发生产部署，推送到非主分支则会生成带有独立 URL 的预览部署。

## 方式二：Wrangler 上传产物

适合在本地或外部 CI 完成构建后直接上传产物，不消耗 Cloudflare Pages 自带的构建分钟数。

```bash
pnpm add -g wrangler
wrangler login
pnpm build
wrangler pages deploy dist --project-name=shirone-blog
```

::: warning Git 项目不能直接接收 CLI 上传
同一个 Pages 项目只能二选一：关联 Git 执行自动构建，或采用 Direct Upload 模式上传预构建文件。对已绑定 Git 仓库的项目执行 `wrangler pages deploy` 会直接报错。

若需要通过 CLI 上传产物，请在控制台新建一个独立的 **Direct Upload** 项目（不绑定 Git、不填写构建命令），并将 `--project-name` 参数指向该项目。
:::

## 自定义域名

1. 进入项目详情页，依次点击 **Custom domains** -> **Set up a custom domain**，输入目标域名；
2. 若域名托管在当前 Cloudflare 账号下，平台将自动配置 DNS 解析；若在第三方服务商处管理，请按提示添加一条指向 `<name>.pages.dev` 的 `CNAME` 记录；
3. SSL 证书将在解析生效后自动签发。

## 缓存

Cloudflare Pages 默认的缓存策略适用于静态站点：HTML 资源保持短缓存以迅速体现更新，带有指纹哈希的静态资源保持长期缓存。若需进行定制控制，可在 `public/` 目录下添加 `_headers` 配置文件：

```ini title="public/_headers"
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400
```

## 常见问题

::: collapse
- 构建失败：`Unsupported engine`

  未配置 `NODE_VERSION=26` 环境变量，或构建命令未指定 pnpm。确认构建命令填写为 `pnpm build`，并声明环境变量 `PNPM_VERSION=11.28.2`。Node.js 26 不再内置 corepack，不要使用 `corepack enable` 替代手动安装。

- 构建失败：`__dirname is not defined`

  误将项目创建成了 Cloudflare Worker。请删除该 Worker，重新创建类型为 Pages 的项目并关联 Git。

- 免费构建额度耗尽

  Cloudflare 免费套餐每月提供 500 次构建。GitHub Actions 与 Pages 各自独立计算额度。对于高频的内容微调，建议合并多次提交后推送，或改用 Wrangler 直接上传产物。

- 中国大陆访问延迟较高

  Cloudflare 在中国大陆的骨干网路由存在波动。若博客读者主要集中在大陆地区，建议对比评估 [EdgeOne Pages](/guide/deploy/edgeone/)。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：对比其他托管服务
- [部署钩子](/guide/content-separation/deploy-hooks/)：双仓更新后通过 Webhook 触发重建
