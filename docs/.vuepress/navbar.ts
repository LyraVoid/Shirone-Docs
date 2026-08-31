/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([

  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: ' 标签', link: '/blog/tags/' },
  { text: '归档', link: '/blog/archives/' },
  {
    text: '笔记',
    items: [{ text: '示例', link: '/demo/README.md' }]
  },
])
export const enNavbar = defineNavbarConfig([

  { text: '首页', link: '/en/' },
  { text: '博客', link: '/en/blog/' },
  { text: ' 标签', link: '/en/blog/tags/' },
  { text: '归档', link: '/en/blog/archives/' },
  {
    text: '笔记',
    items: [{ text: '示例', link: '/en/demo/README.md' }]
  },
])
