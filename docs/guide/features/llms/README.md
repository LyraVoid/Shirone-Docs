---
title: LLM 友好内容
createTime: 2026/09/01 00:53:00
permalink: /guide/features/llms/
---

Shirone 内置 [llmstxt.org](https://llmstxt.org/) 规范的 AI 友好内容系统：构建期自动生成 `/llms.txt`（结构化索引）与 `/llms-full.txt`（全量正文汇编），让 ChatGPT、Claude、Perplexity、Cursor 等大语言模型与 AI Agent 高效理解你的站点。客户端 JS 主包增加 0 KB，对前台读者零影响。

## 生成机制

构建期自动完成，**平时写作无需维护任何登记**：

1. **文章收录**：自动扫描全站公开文章，提取标题、链接、简介与标签
2. **站点信息**：标题、副标题与简介自动继承 `siteConfig` 与 `profileConfig`
3. **正文清洗**：`/llms-full.txt` 自动展开 `<llm-only>` AI 专属提示，自动剔除 `<llm-exclude>` 内容
4. **安全隔离**：自动过滤加密文章（`encrypted: true`）与草稿（`draft: true`），绝不泄漏私密内容

## 配置

```ts title="src/config/llmsConfig.ts"
export const llmsConfig = withUserConfig("llms", {
  enable: true,              // 生成端点总开关
  generateFull: true,        // 是否生成全量正文 /llms-full.txt
  siteSummary: "",           // 站点在大模型眼中的自我介绍（可留空）
  descriptionMaxLength: 200, // 索引中单篇摘要截断字数
  excludeTags: ["secret", "private"],   // 敏感标签黑名单
  excludeCategories: [],     // 敏感分类黑名单
  corePages: [ /* 核心引导页 */ ],
  customSections: [],        // 自定义扩展章节
})
```

## 字段详解

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `enable` | `true` | `false` 时彻底禁用，访问对应链接返回 404，不产生构建文件 |
| `generateFull` | `true` | `false` 时仅生成 `/llms.txt` 目录索引，跳过全量正文（文章量极大时推荐） |
| `siteSummary` | `""` | 站点介绍；留空回退 `siteConfig.subtitle` 或 `profileConfig.bio` |
| `descriptionMaxLength` | `200` | 索引中单篇摘要截断上限，超出补省略号；不影响全量正文 |
| `excludeTags` | `["secret", "private"]` | 命中任一标签的文章从两个端点同时剔除（即使文章公开） |
| `excludeCategories` | `[]` | 命中分类的文章彻底排除 |
| `corePages` | 三个默认页 | 向 AI 重点介绍的核心栏目；空数组使用默认 |
| `customSections` | `[]` | 自定义扩展章节（外部项目/API 文档等） |

## 常用场景

**默认使用（推荐）**

保持默认即可——全站公开文章自动收录，无需任何维护。

**文章量极大，只留目录**

```ts
generateFull: false,
```

**保护私密标签**

```ts
excludeTags: ["secret", "private", "diary"],
```

**补充自定义章节**

```ts
customSections: [
  {
    title: "Open Source Projects",
    description: "Featured repositories maintained by the author.",
    items: [
      { title: "Shirone Theme", url: "https://github.com/LyraVoid/Shirone",
        description: "M3E blog theme for Astro." },
    ],
  },
],
```

## 双仓覆盖

内容仓 `config/llms.yaml` 只写想改的键即可（如 `siteSummary`、`excludeTags`）；合并规则为「对象递归合并、数组整体替换」——因此改 `corePages` / `customSections` 需要把整个清单写全。

## 验证

构建后检查产物：

```text
dist/llms.txt         # 结构化索引
dist/llms-full.txt    # 全量正文汇编（generateFull: true 时）
```

直接在 ChatGPT/Claude 中输入「读取 https://your-site.com/llms.txt 并总结这个站点」即可体验效果。

## 常见问题

**私密内容会被 AI 读到吗**

不会。加密文章与草稿在构建期被过滤；命中 `excludeTags` / `excludeCategories` 的公开文章也会被剔除。但注意：**没有加密也未命中黑名单的公开文章本来就可以被任何人访问**——LLM 端点只是提供了更结构化的读取方式。

**文章更新后 llms.txt 会更新吗**

会。两个端点都是构建期静态生成，随每次构建自动重建。

**会拖慢构建或影响读者吗**

不会。纯服务端静态文本生成，客户端 JS 主包 0 KB 增加，前台浏览速度零影响。
