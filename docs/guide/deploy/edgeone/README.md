---
title: 部署到 EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /guide/deploy/edgeone/
---

本文介绍 EdgeOne Pages 平台的具体设置。构建位置选择与平台构建命令的开关说明，详见[部署总览](/guide/deploy/overview/)。

EdgeOne Pages 是腾讯云提供的静态托管服务，国内节点访问延迟较低。读者群体若主要分布在中国大陆，可优先考虑该方案。

## 前置条件

- 代码已推送到 GitHub 仓库；
- 拥有腾讯云账号并开通相关服务；
- `site` 已设置为正式域名。单仓修改 `src/config/siteConfig.ts`，双仓修改内容仓的 `config/site.yaml`。

## 部署步骤

::: steps

1. **进入服务控制台**

   登录[腾讯云控制台](https://console.cloud.tencent.com/)，搜索并进入 **EdgeOne Pages**。

2. **导入代码仓库**

   点击 **创建项目** -> **导入 Git 仓库**。初次使用时将跳转至 GitHub 进行账号授权。

3. **选择仓库与分支**

   选中 Shirone 仓库，生产分支指定为 `main`。

4. **配置构建参数**

   填写以下构建配置信息：

   | 配置项 | 设定值 |
   | --- | --- |
   | 框架预设 | `Astro` 或“静态网站” |
   | 构建命令 | `pnpm build` |
   | 输出目录 | `dist` |
   | Node.js 版本 | `24` |

   构建命令必须显式填写为 `pnpm build`。主题的 `preinstall` 钩子会强制校验包管理器，使用 npm 安装依赖将导致构建直接失败。

5. **执行首次部署**

   点击确认部署，等待构建流程完成（约 3 至 5 分钟）。

:::

部署完成后平台会分配一个形如 `<random>.edgeone.app` 的默认访问域名。推送到 `main` 分支会自动触发重新部署。

## 创建部署触发器

用于[部署钩子](/guide/content-separation/deploy-hooks/)流程：进入项目设置 -> **构建与部署** -> **部署触发器**，选择分支 `main`，保存并复制生成的触发 URL。

![EdgeOne 部署触发器创建位置](/images/content-separation/04-deploy/02-hook/12-edgeone-deploy-hook.png)

## 自定义域名

1. 进入项目管理页面，依次点击 **域名管理** -> **自定义域名**，添加目标域名；
2. 按照控制台指引在域名 DNS 解析服务商处添加对应的 `CNAME` 记录；
3. 解析生效后，SSL 证书将由平台自动签发。

未备案域名依然可以正常绑定使用，流量将调度至海外或边缘节点加速；已备案域名可直接启用境内全功能加速节点。

## 预览部署

推送到非生产分支会自动生成带有独立域名的预览环境，便于在合并分支前检查 MDX 组件渲染或 Mermaid 图表展示是否正常。

## 常见问题

::: collapse
- 构建报错：`only-allow pnpm`

  构建命令未指定为 pnpm。请在构建配置中改回 `pnpm build`。若因平台镜像内置的 pnpm 版本过旧导致 lockfile 校验失败，可将构建命令调整为 `npm i -g pnpm@11.28.2 && pnpm build`。EdgeOne 目前未提供 `PNPM_VERSION` 环境变量，且 Node.js 24 不内置 corepack。

- 构建报错：Node 版本不匹配

  确认 Node.js 版本已显式选定为 `24`。EdgeOne 控制台目前最高支持 Node 24，Shirone 在 Node 24 环境下可以正常完成构建。

- 双仓模式下如何配置内容源

  在项目的环境变量设置中添加 `CONTENT_REPO_URL`，若需固定分支可添加 `CONTENT_REPO_REF`。构建命令保持为 `pnpm build`，切勿重复拼接 `pnpm content:sync &&`。详见[内容源配置](/guide/content-separation/content-sources/)。

- 全文搜索功能不可用

  核对上传发布的产物目录是否包含完整的 `dist/`，特别是其中的 `dist/pagefind/` 文件夹。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：对比其他托管平台
- [部署钩子](/guide/content-separation/deploy-hooks/)：双仓更新后通过 Webhook 触发重建
