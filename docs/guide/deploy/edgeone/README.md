---
title: 部署到 EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /guide/deploy/edgeone/
---

EdgeOne Pages 是腾讯云推出的静态托管服务，对国内访问友好、免费额度充足，是面向国内读者的 Shirone 博客的推荐部署方案。

## 为什么推荐 EdgeOne Pages

- 国内边缘节点覆盖好，访问延迟显著低于 Vercel / Netlify / Cloudflare 的海外节点
- 免费额度慷慨，个人博客基本零成本
- 与 GitHub 深度集成，推送即构建
- 自动签发 SSL，无需备案也可绑定域名（但国内节点加速需备案域名）

## 前置条件

- 代码已托管在 GitHub
- 注册[腾讯云账号](https://cloud.tencent.com/)
- `src/config/siteConfig.ts` 中的 `site` 已设置为正式域名

## 部署步骤

::: steps

1. 登录[腾讯云控制台](https://console.cloud.tencent.com/)，搜索 **EdgeOne Pages**（或在 EdgeOne 产品页左侧导航进入）。

2. 点击 **创建项目 → 导入 Git 仓库**，首次使用会跳转 GitHub 授权页，点击 **Authorize** 完成授权。

3. 从仓库列表中选择你的 Shirone 仓库与生产分支（`main`）。

4. 配置构建设置：

   | 配置项 | 值 |
   | --- | --- |
   | 框架预设 | `Astro` 或「静态网站」 |
   | 构建命令 | `pnpm build` |
   | 输出目录 | `dist` |
   | Node.js 版本 | `22` |

   **注意：构建命令必须显式指定为 `pnpm build`。** 不要使用默认的 `npm run build`——Shirone 通过 `preinstall` 钩子强制使用 pnpm（`only-allow pnpm`），npm 构建会在安装依赖阶段直接失败。

5. 点击 **部署**，等待构建完成（约 3-5 分钟）。

:::

部署完成后你会获得默认域名 `<random>.edgeone.app`。此后推送 `main` 自动触发重新部署，控制台可查看构建历史与实时日志。

## 自定义域名

1. 进入项目 **域名管理 → 自定义域名**，添加你的域名（如 `blog.yourdomain.com`）。
2. 按提示在域名服务商添加 `CNAME` 记录。
3. SSL 证书自动颁发。

::: tip 备案与加速节点
- 未备案域名：可正常访问，走海外/边缘节点
- 已备案域名：可启用中国境内加速节点，国内访问速度最佳
:::

## 预览部署

每次推送非生产分支会自动生成预览环境，可在合并前验证文章渲染效果——对涉及 MDX 组件、Mermaid 图表等增强语法的文章尤其有用。

## 常见问题

**构建失败：`npm ERR!` 或 `only-allow pnpm`**

构建命令未使用 pnpm。改回 `pnpm build`；若平台镜像的 pnpm 版本过旧导致 lockfile 校验失败，在环境变量中固定 `PNPM_VERSION=9` 或使用 `corepack enable && pnpm build`。

**构建失败：Node 版本不匹配**

确认 Node.js 版本设置为 `22`。日志中出现 `SyntaxError`（如 `??` 运算符解析失败）通常就是 Node 版本过低。

**双仓模式（Shirone-Content）**

在项目环境变量中配置 `CONTENT_REPO_URL`（私有仓使用 `https://x-access-token:<TOKEN>@github.com/...` 形式），`content:sync` 会在构建时自动拉取内容仓。也可以参考主题仓库 `deploy.yml.example` 的变体 D：由 GitHub Actions 触发 EdgeOne 的 Deploy Hook。

**搜索不可用**

与所有平台同理：Pagefind 索引由 `pnpm build` 生成于 `dist/pagefind/`，若使用自定义 CI 上传产物，务必包含整个 `dist` 目录。
