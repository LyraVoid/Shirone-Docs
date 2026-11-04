---
title: 部署到 Vercel
createTime: 2026/08/31 21:50:00
permalink: /guide/deploy/vercel/
---

本文介绍 Vercel 平台的具体配置。构建位置选择与平台构建命令的开关说明，详见[部署总览](/guide/deploy/overview/)。

Vercel 支持连接 Git 仓库自动构建，亦可仅作为静态服务器接收预先构建完成的 `dist/` 产物。请根据架构选择其中一种方式。

## 前置条件

- 代码已推送到 GitHub、GitLab 或 Bitbucket 托管平台；
- `site` 已设置为正式上线域名。单仓修改 `src/config/siteConfig.ts`，双仓修改内容仓的 `config/site.yaml`。

## 方式一：Git 集成（平台构建）

::: steps

1. **导入仓库**

   访问 [vercel.com/new](https://vercel.com/new)，选择并导入 Shirone 仓库。

2. **确认构建设置**

   Vercel 会自动检测出 Astro 框架并预设参数，核对以下配置项：

   | 配置项 | 设定值 |
   | --- | --- |
   | Framework Preset | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

3. **添加环境变量**

   单仓模式可跳过此步；双仓模式展开 **Environment Variables**，添加以下环境变量：

   | 键名 | 键值 |
   | --- | --- |
   | `CONTENT_REPO_URL` | `https://x-access-token:<TOKEN>@github.com/<OWNER>/<CONTENT_REPO>.git` |
   | `CONTENT_REPO_REF` | `main`（可选） |
   | `GIT_TERMINAL_PROMPT` | `0` |

   公开内容仓可直接填写 `https://github.com/<OWNER>/<CONTENT_REPO>.git`，无需访问令牌。

4. **选择 Node.js 版本**

   项目创建后，进入 **Settings** -> **General** -> **Node.js Version**，选中 `26.x`。Vercel 不读取 `NODE_VERSION` 环境变量。

5. **触发部署**

   点击 **Deploy** 按钮，首次完整构建耗时约 2 至 5 分钟。

:::

![在 Vercel 导入页面填写环境变量](/images/deploy/vercel/01-import-environment.png)

![Vercel 部署完成后的项目概览](/images/deploy/vercel/02-project-overview.png)

部署完成后，推送到 `main` 分支会自动触发生产部署，推送到其他分支则会生成带有独立预览域名的预览部署。

### 修改环境变量

若导入时遗漏或后续需要更新令牌，可进入 **Deployments** -> **Environments**，选择 Production、Preview 或 Development 环境进行修改，更新后需重新触发一次部署。

![Vercel Deployments 下的 Environments](/images/deploy/vercel/03-environments.png)

## 方式二：Actions 或本地交付 dist

由 GitHub Actions 或本地完成构建后，将静态文件直接分发至 Vercel。流程参阅[跨仓自动构建](/guide/content-separation/ci-dispatch/)或[本地构建](/guide/deploy/local/)。

采用此方式前，必须先在 Vercel 中将项目调整为纯静态托管：

1. 进入 **Settings** -> **Build & Output Settings**；
2. 将 **Framework Preset** 修改为 `Other`；
3. 关闭 **Build Command** 的 Override 开关，并清空命令内容；
4. 关闭 **Output Directory** 的 Override 开关，并清空目录内容；
5. 进入 **Settings** -> **Git**，断开仓库关联或关闭自动构建开关。

仅断开 Git 关联不足以停止构建，构建命令仍保留在项目设置中，必须手动清空。

执行上传命令：

```bash
pnpm dlx vercel@latest deploy dist --prod
```

首次运行需按照提示登录并关联项目。

## 自定义域名

1. 进入 **Settings** -> **Domains**，绑定个人域名；
2. 依据页面指引添加 `A` 记录（指向 `76.76.21.21`）或 `CNAME` 记录（指向 `cname.vercel-dns.com`）；
3. DNS 记录解析生效后，平台将自动签发 SSL 证书。

## vercel.json

仓库根目录已内置 `vercel.json`，可为静态资源配置长缓存响应头：

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
- 部署日志报错 `Command "pnpm build" exited with 1`

  项目采用了“上传 dist”模式，但 Vercel 项目设置中仍保留了原构建命令。请按照“方式二”清空 Build Command 与 Output Directory 后重新部署。日志中不再出现 `Running "vercel build"` 即表明配置生效。

- 构建失败：Node 版本过低

  进入 **Settings** -> **General** -> **Node.js Version**，选中 `26.x`。配置 `NODE_VERSION` 环境变量对 Vercel 构建机无效。

- 构建超时

  Shirone 完整构建包含内容同步、图片优化、字体子集化及 Pagefind 全文索引。若构建频繁超时，建议改用 GitHub Actions 构建并交付产物，详见[跨仓自动构建](/guide/content-separation/ci-dispatch/)。

- 全文搜索功能不可用

  核对上传的发布产物中是否包含完整的 `dist/pagefind/` 目录。在自定义 CI 流水线中容易因过滤导致该目录缺失。
:::

## 下一步

- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：使用 GitHub Actions 构建并交付至 Vercel
- [部署总览](/guide/deploy/overview/)：对比其他静态托管平台
