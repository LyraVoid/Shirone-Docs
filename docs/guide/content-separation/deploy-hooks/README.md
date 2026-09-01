---
title: 云托管平台 Deploy Hook 部署
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/deploy-hooks/
---

# 云托管平台 Deploy Hook 部署

如果你习惯将主题代码仓直接托管在 Cloudflare Pages、Vercel、腾讯云 EdgeOne 或 Netlify 等平台，并由平台自身的构建机拉取内容进行打包，你可以使用 ==部署钩子触发模式==。

在这种模式下，内容仓库每次推送更新，会自动向托管平台的 Deploy Hook 发送一次 HTTP POST 请求，平台构建机接收到请求后会自动触发拉取与编译。

```mermaid
sequenceDiagram
    autonumber
    actor Author as "✍️ 博主 (内容仓)"
    participant ContentRepo as "🔒 私有内容仓库"
    participant Cloudflare as "☁️ Cloudflare Pages / Vercel"
    participant CDN as "🚀 生产网络"

    Author->>ContentRepo: 1. git push 推送新文章或配置修改
    ContentRepo->>Cloudflare: 2. POST 触发 Deploy Hook Webhook
    Cloudflare->>ContentRepo: 3. 构建机拉取私有内容仓库 (通过 Token)
    Cloudflare->>Cloudflare: 4. 执行 pnpm content:sync && pnpm build
    Cloudflare->>CDN: 5. 自动全网边缘分发
```

---

## 1. Cloudflare Pages 接入指南 <Badge text="推荐" type="tip" />

::: steps
1. **在 Cloudflare Pages 中创建 Deploy Hook**

   - 登录 Cloudflare 控制台，进入 **Workers & Pages**；
   - 点击你的博客项目，前往 **Settings** -> **Builds & deployments**；
   - 滚动到 **Deploy hooks** 区域，点击 **Add deploy hook**；
   - **Deploy hook name**：填写 `content-push`；
   - **Branch to build**：选择 ==main==；
   - 点击 **Add hook** 并**复制生成的完整 Webhook URL**。

   ![Cloudflare Pages 创建 Deploy Hook](/images/content-separation/04-deploy/02-hook/07-deploy-hook-config.png)

2. **在 Cloudflare Pages 中配置环境变量**

   进入项目的 **Settings** -> **Environment variables**，添加生产环境变量：
   - **CONTENT_REPO_URL**：==带访问令牌的私有 Git URL=={.error}：
     ```text title="CONTENT_REPO_URL 格式"
     https://x-access-token:你的访问令牌@github.com/你的用户名/my-blog-content.git
     ```
   - **Build command**：设置为 `pnpm content:sync && pnpm build`。

3. **在 GitHub 内容仓库中配置 Secret**

   - 进入你的私有内容仓库，打开 **Settings** -> **Secrets and variables** -> **Actions**；
   - 点击 **New repository secret**；
   - **Name**：填写 ==CLOUDFLARE_DEPLOY_HOOK=={.tip}；
   - **Secret**：粘贴第一步复制的 Cloudflare Deploy Hook URL；
   - 点击 **Add secret** 保存。

   ![配置 Cloudflare Secret](/images/content-separation/04-deploy/02-hook/11-actions-repository-secrets.png)

4. **在内容仓库中添加触发工作流**

   在私有内容仓库新建 `.github/workflows/trigger-cloudflare.yml`：

   ```yaml title=".github/workflows/trigger-cloudflare.yml"
   name: Trigger Cloudflare Pages Build

   on:
     push:
       branches: [main]
     workflow_dispatch:

   jobs:
     deploy-hook:
       runs-on: ubuntu-latest
       steps:
         - name: Call Cloudflare Deploy Hook
           run: |
             curl -X POST "${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}" # [!code highlight]
   ```
:::

---

## 2. Vercel 接入指南 <Badge text="主流" type="info" />

::: steps
1. **在 Vercel 中创建 Deploy Hook**

   - 登录 Vercel 控制台，进入你的博客项目；
   - 前往 **Settings** -> **Git**；
   - 滚动到 **Deploy Hooks** 区域；
   - **Hook Name**：填写 `content-update`；
   - **Branch**：填写 `main`；
   - 点击 **Create Hook** 并复制生成的 Webhook URL。

2. **在 Vercel 中配置环境变量**

   进入 **Settings** -> **Environment Variables**：
   - **CONTENT_REPO_URL**：`https://x-access-token:你的访问令牌@github.com/你的用户名/my-blog-content.git`
   - **Build Command**：`pnpm content:sync && pnpm build`

3. **在 GitHub 内容仓库中配置 Secret**

   在私有内容仓库的 **Settings** -> **Secrets and variables** -> **Actions** 中添加：
   - **Name**：==VERCEL_DEPLOY_HOOK=={.tip}
   - **Secret**：粘贴复制的 Vercel Webhook URL。
:::

---

## 3. 腾讯云 EdgeOne 接入指南 <Badge text="国内加速" type="tip" />

::: steps
1. **在 EdgeOne 中创建部署触发器**

   - 登录腾讯云 EdgeOne Pages 控制台；
   - 进入项目设置 -> **构建与部署** -> **部署触发器 (Deploy Hook)**；
   - 新增部署钩子，分支绑定为 `main` 并生成触发 URL。

2. **在 EdgeOne 中配置环境变量**

   - **CONTENT_REPO_URL**：填写带个人访问令牌的 GitHub 内容仓克隆地址；
   - **构建命令**：`pnpm content:sync && pnpm build`。

3. **在 GitHub 内容仓库中配置 Secret**

   在私有内容仓库的 **Settings** -> **Secrets and variables** -> **Actions** 中添加：
   - **Name**：==EDGEONE_DEPLOY_HOOK=={.tip}
   - **Secret**：粘贴复制的 EdgeOne 部署钩子 URL。
:::

---

## 4. Netlify 接入指南

::: steps
1. **在 Netlify 中创建 Build Hook**

   - 进入项目的 **Site configuration** -> **Build & deploy** -> **Continuous deployment**；
   - 找到 **Build hooks**，点击 **Add build hook**；
   - 填写名称并将分支指定为 `main`，点击 **Save** 并复制生成的 Webhook URL。

2. **在 GitHub 内容仓库中配置 Secret**

   在私有内容仓库的 **Settings** -> **Secrets and variables** -> **Actions** 中添加：
   - **Name**：==NETLIFY_DEPLOY_HOOK=={.tip}
   - **Secret**：粘贴复制的 Netlify Webhook URL。
:::

---

## 密钥名称对照速查表

内容仓自动化触发工作流中支持的部署密钥对照：

| 托管平台 | GitHub Secret 变量名（严格匹配） | 触发机制说明 |
| :--- | :--- | :--- |
| **跨仓联动构建（推荐）** | `DISPATCH_TOKEN` <Badge text="推荐" type="tip" /> | 通知主题代码仓通过 GitHub Actions 执行拉取、编译与发布 |
| **Cloudflare Pages** | `CLOUDFLARE_DEPLOY_HOOK` <Badge text="边缘" type="info" /> | 推送后向 Cloudflare Deploy Hook 发送 POST 请求触发重新拉取与构建 |
| **Vercel** | `VERCEL_DEPLOY_HOOK` <Badge text="全球" type="info" /> | 推送后向 Vercel Deploy Hook 发送 POST 请求触发重新部署 |
| **腾讯云 EdgeOne** | `EDGEONE_DEPLOY_HOOK` <Badge text="国内" type="tip" /> | 推送后向 EdgeOne 部署钩子发送 POST 请求触发构建发布 |
| **Netlify** | `NETLIFY_DEPLOY_HOOK` <Badge text="通用" type="info" /> | 推送后向 Netlify Build Hook 发送 POST 请求触发重新编译 |

---

## 下一步

- 前往 [常见问题与排错](/guide/content-separation/faq/)：查阅权限排查、字段覆盖与构建报错解决方案
