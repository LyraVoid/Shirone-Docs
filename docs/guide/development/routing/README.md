---
title: 路由系统
createTime: 2026/09/01 03:40:00
permalink: /guide/development/routing/
---

Shirone 使用 Astro 文件路由与内容集合生成静态页面。固定链接优先级见[固定链接](/guide/writing/advanced/permalink/)。

| 文件 | 作用 |
| --- | --- |
| `src/pages/[...page].astro` | 首页与文章列表分页 |
| `src/pages/posts/[...slug].astro` | 默认 `/posts/<slug>/` 文章路由 |
| `src/pages/[...permalink].astro` | 全局模板与单篇自定义固定链接 |
| `src/pages/about.astro` 等 | 关于、番剧、友链、项目等独立页面 |
| `src/pages/albums/[id]/index.astro` | 相册详情页 |

在 `src/pages/` 创建 `.astro` 文件即可生成路由，但不会自动加入导航；还需要在 `src/config/navBarConfig.ts` 或内容仓导航覆盖中登记链接，并提供 SEO 与无障碍标题。

不要在多个入口注册同一路径。修改已发布 URL 时，同时处理固定链接、站点地图和旧地址重定向。
