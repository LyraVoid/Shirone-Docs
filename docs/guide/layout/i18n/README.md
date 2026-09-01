---
title: 国际化与语言包
createTime: 2026/09/01 03:40:00
permalink: /guide/layout/i18n/
---

Shirone 将界面文案与文章内容分开处理。导航、按钮和提示语来自 `src/i18n/`；文章正文由作者自行决定语言。

## 配置语言

在 `src/config/siteConfig.ts` 设置默认界面语言：

```ts
export const siteConfig = withUserConfig("site", {
  lang: "zh_CN",
});
```

代码必须对应 `src/i18n/languages/` 中的词典。Shirone 内置 10 种界面语言；`lang` 只影响界面，不会翻译 Markdown 文章。

## 新增翻译

1. 复制最接近的语言词典。
2. 保持 key 名称，只翻译 value。
3. 为全部语言补齐新增 key。
4. 运行 `npx astro check` 与 `pnpm build` 验证。

翻译 key 由 `src/i18n/i18nKey.ts` 统一定义，组件通过 `i18n()` 读取当前语言文案。双语站点通常由 `/` 与 `/en/` 入口组织导航；文章的 `lang` 仅标注文章语言，不会自动生成译文。
