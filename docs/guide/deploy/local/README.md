---
title: 本地构建
createTime: 2026/08/31 21:57:00
permalink: /guide/deploy/local/
---

本地构建是所有其他静态部署方案的底座基础：执行构建输出 `dist/` 产物后，可直接交给任意静态资源托管服务。本文介绍构建流程与产物分发方式，平台侧设置说明详见[部署总览](/guide/deploy/overview/)。

该方案适合需要对生成物进行绝对控制、离线环境编写，或在上线发布前需要本地复现平台构建问题的场景。

## 构建步骤

::: steps

1. **安装项目依赖**

   ```bash
   pnpm install --frozen-lockfile
   ```

2. **执行完整构建**

   ```bash
   pnpm build
   ```

3. **本地预览产物**

   ```bash
   pnpm preview
   ```

   在浏览器中打开 `http://localhost:4321`，核对页面渲染、全文搜索与 RSS 订阅源。

:::

双仓模式下，需预先在 `.env` 中设置 `CONTENT_DIR` 或 `CONTENT_REPO_URL`，`pnpm build` 在执行期间会自动同步内容仓。详见[内容源配置](/guide/content-separation/content-sources/)。

## pnpm build 做了什么

| 构建子阶段 | 核心任务 |
| --- | --- |
| `content:sync` | 同步物化内容仓文件，编译生成配置桥接文件 |
| 图片处理 | 生成多规格缩略图，转换并优化现代图片格式 |
| `astro build` | 静态编译渲染全站 HTML 页面与静态资产 |
| `pagefind` | 提取文章文本，生成全站离线搜索索引 `dist/pagefind/` |
| `fonts:check` | 验证字体子集化产物是否完整覆盖页面文本字符 |

切勿使用 `astro build` 代替 `pnpm build`，否则将缺失 Pagefind 离线搜索索引。

## 产物结构

```file-tree title="dist/"
dist/
├── index.html
├── pagefind/           # 全文搜索索引，发布时不可遗漏
├── assets/             # 包含哈希指纹的 JS、CSS、图片与子集字体
├── rss.xml
├── sitemap-index.xml
└── favicon.ico
```

部署或分发时需将整个目录完整打包上传。

## 分发方式

### 自建服务器

```bash
rsync -avz --delete dist/ user@server:/var/www/shirone/dist/
```

配套 Nginx 配置文件详见[服务器部署](/guide/deploy/server/)。

### Vercel

```bash
pnpm dlx vercel@latest deploy dist --prod
```

### Cloudflare Pages

```bash
pnpm add -g wrangler
wrangler login
wrangler pages deploy dist --project-name=shirone-blog
```

### 对象存储与 CDN

阿里云 OSS、腾讯云 COS 等对象存储服务均原生支持静态网站托管。以腾讯云 COS CLI 为例：

```bash
coscmd upload -rs dist/ /
```

在云控制台开启静态网站托管属性、绑定自定义域名并配置 CDN 加速即可上线。

::: warning 交付产物前先关闭平台构建
分发上传的是已构建好的静态产物，托管平台切勿重复执行构建：

- **Vercel**：将 Framework Preset 选为 `Other`，清空 Build Command，断开 Git 自动构建触发器，避免报错 `Error: Command "pnpm build" exited with 1`；
- **Cloudflare Pages**：CLI 上传需在控制台单独创建 Direct Upload 项目，不可直接向已关联 Git 的项目推送；
- **Netlify**：执行 `netlify deploy --prod --dir=dist` 时切勿携带 `--build` 参数。

各平台的具体操作入口详见对应平台指南。
:::

## 验证清单

- [ ] 在 `pnpm preview` 环境下核对首页、文章详情、归档页与全文搜索均工作正常
- [ ] 产物目录中 `dist/pagefind/` 存在且包含索引碎片文件
- [ ] 构建终端输出中无 frontmatter 类型校验错误
- [ ] `site` 已指定为正式生产域名（单仓修改 `siteConfig.ts`，双仓修改 `config/site.yaml`）
- [ ] `dist/rss.xml` 文件中的文章永久链接均可正常跳转访问

## 常见问题

::: collapse
- 构建成功但搜索功能报 404

  生成物中缺失 `pagefind/` 文件夹。通常是误将构建命令替换成了 `astro build`，请改回执行 `pnpm build`。

- 本地预览正常但线上展示异常

  对比排查生产域名的 `site` 与 `base` 配置、检查上传到服务器的 `dist/` 是否包含全部资源（包括隐藏文件），以及确认 CDN 或反向代理是否缓存了 HTML 响应。

- 如何缩短本地构建耗时

  日常写作预览请直接使用 `pnpm dev`，无需每次运行耗时较长的完整构建。只有在发布上线前才需要执行 `pnpm build`。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：横向对比各个托管平台
- [构建优化](/guide/optimize-build/)：深入了解构建缓存与性能调优
