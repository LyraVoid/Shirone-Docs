---
title: 主题开发与贡献
createTime: 2026/09/01 03:40:00
permalink: /guide/development/theme-contributing/
---

Shirone 由 Astro 页面与 Svelte 交互组件协作构成。开发前先判断功能属于静态输出、客户端交互、配置还是数据，再选择对应目录。

| 类型 | 位置 | 约定 |
| --- | --- | --- |
| 静态页面与布局 | `src/pages/`、`src/layouts/` | 优先 Astro SSR |
| 交互控件 | `src/components/` | Svelte 5 Runes，按需水合 |
| 配置行为 | `src/config/*Config.ts` | 默认值与类型分离维护 |
| 内容实体 | `src/data/`、`src/content/` | 不把站点内容写进组件 |
| Markdown 扩展 | `src/plugins/markdown/` | 同步注册插件与样式 |

## 提交前检查

```bash
pnpm format
pnpm lint
pnpm type-check
npx astro check
pnpm test
pnpm build
```

新增组件时补充可访问性语义、键盘操作、暗色模式和 reduced-motion 行为。禁用可选功能后，应确认不会留下多余脚本、DOM 或外部请求。
