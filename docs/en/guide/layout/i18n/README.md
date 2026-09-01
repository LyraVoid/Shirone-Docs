---
title: Internationalization & Language Packs
createTime: 2026/09/01 03:40:00
permalink: /en/guide/layout/i18n/
---

Shirone keeps interface copy separate from article content. Navigation, buttons, and notices come from `src/i18n/`; authors choose the language of each post.

## Configure a Language

Set the default interface language in `src/config/siteConfig.ts`:

```ts
export const siteConfig = withUserConfig("site", {
  lang: "en",
});
```

The code must match a dictionary under `src/i18n/languages/`. Shirone ships 10 interface locales. `lang` changes UI copy, not Markdown content.

## Add a Translation

1. Copy the closest dictionary.
2. Keep key names and translate values only.
3. Add each new key to every locale.
4. Run `npx astro check` and `pnpm build`.

Keys live in `src/i18n/i18nKey.ts`; components resolve them through `i18n()`. Bilingual sites commonly use `/` and `/en/` entry points. A post's `lang` only labels its language and does not create a translation automatically.
