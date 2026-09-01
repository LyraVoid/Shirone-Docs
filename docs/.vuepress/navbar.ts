/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'ri:home-2-line' },
  { text: '文档', link: '/guide/intro/', icon: 'ri:book-open-line' },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/', icon: 'ri:home-2-line' },
  { text: 'Docs', link: '/en/guide/intro/', icon: 'ri:book-open-line' },
])
