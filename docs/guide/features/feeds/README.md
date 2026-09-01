---
title: 订阅与机器可读输出
createTime: 2026/09/01 03:20:00
permalink: /guide/features/feeds/
---

Shirone 会在构建时生成订阅、搜索引擎和 AI 工具可读取的静态文本输出。它们都来自同一套站点配置与文章数据，不需要运行时服务器。

## 输出清单

| 地址 | 格式 | 用途 | 生成条件 |
| --- | --- | --- | --- |
| `/rss.xml` | RSS 2.0 | Feed 阅读器、订阅聚合器 | 始终生成 |
| `/atom.xml` | Atom 1.0 | 支持 Atom 的订阅客户端 | 始终生成 |
| `/sitemap-index.xml` | XML Sitemap | 搜索引擎发现页面 | Astro Sitemap 集成生成 |
| `/robots.txt` | Plain text | 爬虫访问约束与 Sitemap 声明 | 始终生成 |
| `/llms.txt` | Markdown | 向 AI 工具提供站点索引 | `llms.enable` 为 `true` |
| `/llms-full.txt` | Markdown | 提供公开文章的完整正文 | `llms.enable` 与 `llms.generateFull` 均为 `true` |

所有 URL 都使用 `siteConfig.site`（或构建上下文中的 `site`）生成绝对地址。部署到子路径时，还会遵循 Astro 的 `base` 配置。

---

## RSS 与 Atom

RSS 和 Atom 都由 `getFeedPosts()` 提供文章数据，默认只收录可公开发布的文章。每项包含标题、发布日期、摘要、文章链接和渲染后的 HTML 内容。

- RSS 使用 `@astrojs/rss` 生成，语言来自 `siteConfig.lang`。
- Atom 使用 Shirone 的 `buildAtomXml()` 生成，作者名称来自 `profileConfig.name`。
- 文章正文中的相对资源会在 Feed 中转换为可访问的站点链接。
- 生产构建会排除草稿；开发环境下草稿仍可用于预览。
- 加密文章会保留订阅条目但执行脱敏：标题带锁定标识，正文替换为密码保护提示；若启用首页隐藏摘要，摘要也会使用安全提示。

订阅地址可以直接交给 Feedly、Inoreader 等阅读器：

```text
https://example.com/rss.xml
https://example.com/atom.xml
```

---

## Sitemap 与 robots.txt

Astro Sitemap 集成会根据构建出的站点页面生成 `sitemap-index.xml`。它用于告诉搜索引擎哪些公开页面可以抓取；文章、独立页面和分页路由是否出现，取决于对应页面是否在本次构建中生成。

`robots.txt` 的内容由 `src/pages/robots.txt.ts` 提供：

```text
User-agent: *
Disallow: /_astro/

Sitemap: https://example.com/sitemap-index.xml
```

它只禁止抓取构建资源目录，并声明 Sitemap 地址，不会阻止公开文章被索引。若站点部署在子路径或使用自定义域名，必须确保 `siteConfig.site` 与 `base` 设置正确，否则生成的绝对链接可能指向错误地址。

---

## LLM 输出与隐私边界

`/llms.txt` 和 `/llms-full.txt` 由 `llmsConfig` 控制，详细的章节和扩展配置见 [LLM 友好内容](/guide/features/llms/)。两者都执行相同的安全过滤：

- 排除 `draft: true` 的草稿；
- 排除 `encrypted: true` 的加密文章；
- 排除命中 `excludeTags` 的文章；
- 排除命中 `excludeCategories` 的文章。

其中 `/llms.txt` 是标题、链接、摘要组成的索引；`/llms-full.txt` 还会合并公开文章正文，并处理 `<llm-only>` 与 `<llm-exclude>` 标记。

若不希望生成 AI 端点，在 `src/config/llmsConfig.ts` 或内容仓的 `config/llms.yaml` 中设置：

```yaml
enable: false
```

此时两个地址都会返回 404，也不会生成对应的静态文件。只想保留索引时，可设置 `generateFull: false`。

---

## 发布前检查

```bash
pnpm build
```

构建完成后，检查 `dist/` 中是否存在 `rss.xml`、`atom.xml`、`sitemap-index.xml`、`robots.txt`，以及按配置生成的 `llms.txt` 文件。重点确认：

1. `siteConfig.site` 是正式域名，而不是本地预览地址；
2. `base` 与托管平台的访问前缀一致；
3. RSS / Atom 中的加密文章只有脱敏内容，草稿不会进入生产 Feed；LLM 输出同时排除加密文章和草稿；
4. 订阅链接和 Sitemap 返回 `200`，且 XML 能被阅读器或搜索引擎解析。
