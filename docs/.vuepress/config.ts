/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改都会重启 vuepress 服务。
 * 部分配置项的更新没有必要重启 vuepress 服务，建议请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会被覆盖
 */

import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  locales: {
    '/': {
      title: 'Shirone Docs',
      lang: 'zh-CN',
      description: 'Shirone 的技术文档站，记录笔记与实践指南',
    },
    '/en/': {
      title: 'Shirone Docs',
      lang: 'en-US',
      description: 'Shirone\'s technical documentation site, notes and practical guides',
    },
  },

  head: [
    // 配置站点图标
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false, // 站点较大，页面数量较多时，不建议启用

  theme: plumeTheme({
    /* 版权信息 */
    copyright: true,

    /**
     * 编译缓存，加快编译速度
     * @see https://theme-plume.vuejs.press/config/basic/#cache
     */
    cache: 'filesystem',

    /* 本地搜索, 默认启用 */
    search: { provider: 'local' },

    /**
     * Shiki 代码高亮
     * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
     */
    codeHighlighter: {
      twoslash: false, // 禁用 twoslash 避免错误
      whitespace: false, // 禁用 空格/Tab 高亮
      lineNumbers: true, // 启用行号
    },

    /**
     * markdown 增强
     * @see https://theme-plume.vuejs.press/config/markdown/
     */
    markdown: {
      collapse: true, // 启用折叠容器 ::: collapse
      table: true, // 启用表格增强容器语法 ::: table
      mermaid: true, // 启用 mermaid 图表
      codeTree: true, // 启用 code-tree 代码树
      fileTree: true, // 启用 file-tree 文件树
      codeTabs: { icon: true }, // 启用 code-tabs 代码选项组
      field: true, // 启用 field 字段容器
      npmTo: true, // 启用 npmTo 包管理器切换
      timeline: true, // 启用 timeline 时间线
      bilibili: true, // 启用 bilibili 视频嵌入
      youtube: true, // 启用 youtube 视频嵌入
      audioReader: true, // 启用 audioReader 音频朗读
      abbr: true, // 启用缩写词悬浮
      annotation: true, // 启用内容注释
      mark: 'eager', // 启用马克笔高亮
      icon: { provider: 'iconify' }, // 启用图标解析
      caniuse: true, // 启用 caniuse 特性嵌入
      qrcode: true, // 启用 qrcode 二维码
      chat: true, // 启用 chat 对话气泡
    },
  }),
})
