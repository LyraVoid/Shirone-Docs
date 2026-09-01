/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig } from 'vuepress-theme-plume'
import { enCollections, zhCollections } from './collections'
import { enNavbar, zhNavbar } from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/theme/
 */
export default defineThemeConfig({
  logo: '/icon.png',

  /* 社交链接 */
  social: [
    { icon: 'github', link: 'https://github.com/LyraVoid/Shirone' },
  ],

  /* 深色模式 */
  appearance: true,

  locales: {
    '/': {
      /**
       * @see https://theme-plume.vuejs.press/config/theme/#profile
       */
      profile: {
        avatar: '/icon.png',
        name: 'Shirone',
        description: '从零开始看世界',
      },

      navbar: zhNavbar,
      collections: zhCollections,
    },
    '/en/': {
      /**
       * @see https://theme-plume.vuejs.press/config/theme/#profile
       */
      profile: {
        avatar: '/icon.png',
        name: 'Shirone',
        description: 'Seeing the world from scratch',
      },

      navbar: enNavbar,
      collections: enCollections,
    },
  },

  /* 页脚配置 */
  footer: {
    message: false,
    copyright: 'Copyright © 2026-present LyraVoid/Shirone',
  },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/basic/#transition */
  transition: {
    page: true, // 启用 页面间跳转过渡动画
    appearance: 'fade', // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },
})
