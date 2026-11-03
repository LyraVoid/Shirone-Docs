---
title: 部署到 Netlify
createTime: 2026/08/31 21:51:00
permalink: /guide/deploy/netlify/
---

Netlify 是老牌静态托管平台，与 Vercel 定位相近：Git 推送自动构建、免费 SSL、每个 PR 自动生成预览链接。

## 前置条件

- 代码已托管在 GitHub / GitLab / Bitbucket / Azure DevOps
- 站点配置中的 `site` 已设置为正式域名（单仓改 `src/config/siteConfig.ts`，双仓改内容仓的 `config/site.yaml`）

::: tip 单仓 vs 双仓
双仓模式需在 Netlify 环境变量中配置 `CONTENT_REPO_URL`（私有仓使用 `https://x-access-token:<TOKEN>@github.com/...` 形式）、可选的 `CONTENT_REPO_REF`，以及 `GIT_TERMINAL_PROMPT=0`。`pnpm build` 已包含 `content:sync`，构建命令保持 `pnpm build` 即可。
:::

## 方式一：控制台导入

::: steps

1. 登录 [Netlify 控制台](https://app.netlify.com/)，点击 **Add a new site → Import an existing project**。

2. 选择 Git 提供商并授权，从列表中选择你的 Shirone 仓库。

3. 确认构建设置：

   | 配置项 | 值 |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `dist` |

4. 在 **Environment variables** 中添加 `NODE_VERSION = 26`（满足 Node.js ≥ 26.13.0）。

5. 点击 **Deploy** 完成首次部署。

:::

## 方式二：netlify.toml 声明式配置

在仓库根目录创建 `netlify.toml`，将构建配置固化到代码中，避免依赖控制台设置：

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "26"
```

提交后重新推送，Netlify 会自动读取该文件并应用配置。

## 方式三：CLI 部署

```bash
pnpm add -g netlify-cli

netlify login   # 按提示在浏览器中授权
netlify init    # 关联 Git 仓库，自动生成 netlify.toml
netlify deploy --build --prod   # 构建并部署到生产
```

`netlify init` 会向仓库添加部署密钥，此后 `git push` 即可触发自动构建。

## 预览部署

导入项目后，所有对非生产分支的推送、以及每个 Pull Request，都会自动生成独立的预览站点（`<branch>--<site-name>.netlify.app`）。写作时可以先把草稿推到分支，在预览链接中检查排版，再合并到 `main` 发布。

## 自定义域名

::: steps

1. **添加域名**：进入 **Site settings → Domain management → Add a domain**，输入你的域名。
2. **配置 DNS**：按提示添加 DNS 记录（Netlify DNS 托管或外部 CNAME 均可）。
3. **签发 SSL**：SSL 证书由 Let's Encrypt 自动签发与续期，无需手动操作。

:::

## 常见问题

::: collapse
- 构建失败：pnpm 版本不符

  `NODE_VERSION` 只控制 Node，不控制 pnpm。Netlify 优先读取 `package.json` 的 `packageManager`（本仓库为 `pnpm@11.28.2`），新构建镜像也可能通过 mise 安装 pnpm；若日志里的 pnpm 版本仍不匹配，直接改构建命令：

  ```toml
  [build]
    command = "npm i -g pnpm@11.28.2 && pnpm build"
    publish = "dist"
  ```

  Node.js 26 已不再内置 corepack，`corepack enable` 会直接找不到命令。若必须用 corepack，先执行 `npm i -g corepack`，再 `corepack enable`。

- 构建产物体积超限

  Netlify 单次部署限制产物 10k 文件、站点总大小视套餐而定。Shirone 的字体子集化与缩略图机制已尽量控制体积，若仍超限，检查 `public/` 中是否误放了原始大图。

- 国内访问速度

  Netlify 在中国大陆的访问质量不稳定。若你的主要读者在国内，建议优先考虑 [EdgeOne Pages](/guide/deploy/edgeone/)。
:::
