---
title: 本地构建
createTime: 2026/08/31 21:57:00
permalink: /guide/deploy/local/
---

本地构建是所有部署方式的底层原语：理解了它，其他平台（Vercel、EdgeOne、服务器、Docker）的构建环节都只是同一件事在不同环境里的执行。

## 为什么需要本地构建

- **完全控制**：构建时机、产物内容、上传目标全部由你决定
- **离线可用**：无网络时也能写作与构建
- **产物复用**：一次构建，可同时分发到任意多个平台
- **排查利器**：平台构建失败时，本地复现是最快的定位手段

## 构建流程

```bash
# 1. 安装依赖（使用 lockfile，保证环境一致）
pnpm install --frozen-lockfile

# 2. 构建
pnpm build

# 3. 本地预览产物
pnpm preview
```

预览地址为 `http://localhost:4321`。

::: info pnpm build 内部做了什么
Shirone 的构建不止 `astro build`，完整链路为：

1. `content:sync` — 同步内容仓 / 校验 frontmatter（内容与配置问题在这一步暴露）
2. 图标生成、瞬间缩略图生成
3. `astro build` — 渲染全部静态页面
4. 字体子集化 — 按实际用到的字符裁剪字体文件
5. Pagefind — 生成全文搜索索引（`dist/pagefind/`）
6. 字体完整性检查

因此**不要**用 `astro build` 替代 `pnpm build`，否则会缺失搜索索引等关键产物。
:::

## 产物结构

```text
dist/
├── index.html          # 首页及各页面 HTML
├── pagefind/           # 全文搜索索引（必需）
├── assets/             # 指纹化的 JS/CSS/图片/字体
├── rss.xml             # RSS 订阅
├── sitemap-index.xml   # 站点地图
└── favicon.ico 等
```

上传部署时**必须整个目录**一起分发，尤其不能遗漏 `pagefind/`。

## 分发产物的方式

### 上传到虚拟主机 / 服务器

```bash
# rsync（增量，推荐）
rsync -avz --delete dist/ user@server:/var/www/shirone/

# scp（全量）
scp -r dist/* user@server:/var/www/shirone/
```

服务器端 Nginx 配置见 [服务器部署](/guide/deploy/server/)。

### 推送到平台静态托管

以 Wrangler（Cloudflare Pages）为例，本地构建产物可直接上传，不消耗平台构建额度：

```bash
pnpm add -g wrangler
wrangler login
wrangler pages deploy dist --project-name=shirone-blog
```

Vercel 亦支持类似做法：`vercel deploy dist --prod`。

### 对象存储 + CDN

阿里云 OSS、腾讯云 COS 均支持静态网站托管。以 COS 为例：

```bash
# 使用 coscmd（pip 安装）
coscmd upload -rs dist/ /
```

开启「静态网站」属性、绑定自定义域名与 CDN 后即可对外服务。

## 验证清单

部署到任何目标前，建议逐项确认：

- [ ] `pnpm preview` 中首页、文章页、归档、搜索均正常
- [ ] `dist/pagefind/` 目录存在且非空
- [ ] 控制台无构建警告（尤其是 frontmatter 校验错误）
- [ ] `siteConfig.ts` 中 `site` 指向正式域名
- [ ] RSS（`dist/rss.xml`）中的链接可正确跳转

## 常见问题

**构建成功但搜索报 404**

产物中缺少 `pagefind/`。原因几乎都是构建命令被换成了 `astro build`。回到 `pnpm build`。

**本地预览正常、线上异常**

对比两个环境的差异：`site`/`base` 配置、部署平台是否完整上传了 `dist/`（含隐藏文件）、平台是否对 HTML 做了额外缓存。

**想跳过某些构建步骤加速**

写作预览用 `pnpm dev` 即可，无需完整构建。只有最终发布才需要 `pnpm build` 的完整链路。
