---
title: 内容集合 Schema
createTime: 2026/09/01 03:40:00
permalink: /guide/writing/advanced/content-schema/
---

文章字段契约定义在 `src/content.config.ts`。Astro Content Collections 在构建时解析 Frontmatter，并校验字段类型、日期和枚举值。

## Schema 与字段

```ts
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: () => z.object({
    title: z.string(),
    published: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});
```

以源码 Schema 为准，完整字段说明见 [Frontmatter](/guide/frontmatter/)。未知字段不能直接被组件安全使用。

## 扩展字段

1. 在 Schema 中添加字段及默认值或可选性。
2. 更新 `src/types/` 与字段消费者。
3. 更新 Frontmatter 文档与示例。
4. 运行 `npx astro check`、`pnpm type-check` 和 `pnpm build`。

日期字段应使用项目既有的日期约定，避免混用字符串与 `Date`。生产环境集合查询会排除 `draft: true`；启用 `encrypted: true` 时，文章还必须提供非空 `password`。
