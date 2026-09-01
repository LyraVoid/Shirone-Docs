---
title: Content Collection Schema
createTime: 2026/09/01 03:40:00
permalink: /en/guide/writing/advanced/content-schema/
---

The post-field contract lives in `src/content.config.ts`. Astro Content Collections parse frontmatter during the build and validate types, dates, and allowed values.

## Schema and Fields

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

The source schema is authoritative; see [Frontmatter](/en/guide/frontmatter/) for the field reference. Unknown fields cannot safely be consumed by components.

## Extending Fields

1. Add a field with the right default or optionality.
2. Update `src/types/` and every consumer.
3. Update Frontmatter documentation and examples.
4. Run `npx astro check`, `pnpm type-check`, and `pnpm build`.

Follow the project's date convention instead of mixing strings and `Date` values. Production collection queries exclude `draft: true`; an `encrypted: true` post must also have a non-empty `password`.
