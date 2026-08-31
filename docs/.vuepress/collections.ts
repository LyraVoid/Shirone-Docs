/**
 * @see https://theme-plume.vuejs.press/guide/collection/ 查看文档了解配置详情。
 *
 * Collections 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineCollection, defineCollections } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

const zhGuideDoc = defineCollection({
  type: 'doc',
  dir: 'guide',
  linkPrefix: '/guide',
  title: '文档',
  sidebar: [
    {
      text: '从这里开始',
      icon: 'ri:book-open-line',
      prefix: '/guide/',
      collapsed: false,
      items: [
        { text: '介绍', link: 'intro/', icon: 'ri:information-line' },
        { text: '快速开始', link: 'get-started/', icon: 'ri:rocket-line' },
        {
          text: '部署',
          icon: 'ri:cloud-line',
          prefix: '/guide/deploy/',
          collapsed: true,
          items: [
            { text: 'Vercel', link: 'vercel/', icon: 'ri:vercel-line', badge: { type: 'warning', text: '推荐' } },
            { text: 'Netlify', link: 'netlify/', icon: 'ri:cloud-line' },
            { text: 'GitHub Pages', link: 'github/', icon: 'ri:github-line', badge: { type: 'danger', text: '不推荐' } },
            { text: 'Cloudflare Pages', link: 'cloudflare/', icon: 'ri:cloud-line' },
            { text: 'EdgeOne Pages', link: 'edgeone/', icon: 'ri:cloud-line', badge: { type: 'warning', text: '推荐' } },
            { text: '服务器部署', link: 'server/', icon: 'ri:server-line', badge: { type: 'info', text: '入门' } },
            { text: 'Docker 部署', link: 'docker/', icon: 'ri:ship-line' },
            { text: '本地构建', link: 'local/', icon: 'ri:computer-line', badge: { type: 'info', text: '入门' } },
          ],
        },
      ],
    },
    {
      text: '基础布局',
      icon: 'ri:layout-2-line',
      prefix: '/guide/layout/',
      collapsed: false,
      items: [
        { text: '基础配置', link: 'site-config/', icon: 'ri:settings-3-line' },
        { text: '动态配色', link: 'theme-color/', icon: 'ri:palette-line', badge: { type: 'warning', text: '核心' } },
        { text: '横幅与背景', link: 'banner/', icon: 'ri:image-line' },
        { text: '导航栏配置', link: 'navbar/', icon: 'ri:menu-line' },
        { text: '侧栏布局', link: 'sidebar/', icon: 'ri:sidebar-unfold-line' },
        { text: '页脚与博主资料', link: 'footer-profile/', icon: 'ri:user-smile-line' },
        { text: '自定义字体', link: 'font/', icon: 'ri:font-size-2' },
      ],
    },
    {
      text: '编写文章',
      icon: 'akar-icons:pencil',
      prefix: '/guide/writing/',
      collapsed: false,
      items: [
        { text: 'Frontmatter 与文章管理', link: 'frontmatter/', icon: 'ri:file-list-3-line' },
        { text: 'Markdown 基础与增强', link: 'markdown/', icon: 'ri:markdown-line' },
        { text: '图表与媒体嵌入', link: 'media/', icon: 'ri:image-2-line' },
        { text: '代码展示', link: 'code/', icon: 'ri:code-s-slash-line' },
        { text: '图片画廊与文件组织', link: 'gallery/', icon: 'ri:gallery-line' },
        { text: '文章加密', link: 'encryption/', icon: 'ri:key-line' },
      ],
    },
  ],
})

export const zhCollections = defineCollections([
  zhGuideDoc,
])

/* =================== locale: en-US ======================= */

const enGuideDoc = defineCollection({
  type: 'doc',
  dir: 'guide',
  linkPrefix: '/guide',
  title: 'Docs',
  sidebar: [
    {
      text: 'Getting Started',
      icon: 'ri:book-open-line',
      prefix: '/en/guide/',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'intro/', icon: 'ri:information-line' },
        { text: 'Get Started', link: 'get-started/', icon: 'ri:rocket-line' },
        {
          text: 'Deployment',
          icon: 'ri:cloud-line',
          prefix: '/en/guide/deploy/',
          collapsed: true,
          items: [
            { text: 'Vercel', link: 'vercel/', icon: 'ri:vercel-line', badge: { type: 'warning', text: 'Recommended' } },
            { text: 'Netlify', link: 'netlify/', icon: 'ri:cloud-line' },
            { text: 'GitHub Pages', link: 'github/', icon: 'ri:github-line', badge: { type: 'danger', text: 'Not Recommended' } },
            { text: 'Cloudflare Pages', link: 'cloudflare/', icon: 'ri:cloud-line' },
            { text: 'EdgeOne Pages', link: 'edgeone/', icon: 'ri:cloud-line', badge: { type: 'warning', text: 'Recommended' } },
            { text: 'Server Deployment', link: 'server/', icon: 'ri:server-line', badge: { type: 'info', text: 'Basic' } },
            { text: 'Docker', link: 'docker/', icon: 'ri:ship-line' },
            { text: 'Local Build', link: 'local/', icon: 'ri:computer-line', badge: { type: 'info', text: 'Basic' } },
          ],
        },
      ],
    },
    {
      text: 'Basic Layout',
      icon: 'ri:layout-2-line',
      prefix: '/en/guide/layout/',
      collapsed: false,
      items: [
        { text: 'Site Config', link: 'site-config/', icon: 'ri:settings-3-line' },
        { text: 'Dynamic Color', link: 'theme-color/', icon: 'ri:palette-line', badge: { type: 'warning', text: 'Core' } },
        { text: 'Banner & Background', link: 'banner/', icon: 'ri:image-line' },
        { text: 'Navigation Bar', link: 'navbar/', icon: 'ri:menu-line' },
        { text: 'Sidebar Layout', link: 'sidebar/', icon: 'ri:sidebar-unfold-line' },
        { text: 'Footer & Profile', link: 'footer-profile/', icon: 'ri:user-smile-line' },
        { text: 'Custom Fonts', link: 'font/', icon: 'ri:font-size-2' },
      ],
    },
    {
      text: 'Writing',
      icon: 'akar-icons:pencil',
      prefix: '/en/guide/writing/',
      collapsed: false,
      items: [
        { text: 'Frontmatter & Post Management', link: 'frontmatter/', icon: 'ri:file-list-3-line' },
        { text: 'Markdown Basics & Enhancements', link: 'markdown/', icon: 'ri:markdown-line' },
        { text: 'Diagrams & Media Embeds', link: 'media/', icon: 'ri:image-2-line' },
        { text: 'Code Display', link: 'code/', icon: 'ri:code-s-slash-line' },
        { text: 'Image Gallery & File Organization', link: 'gallery/', icon: 'ri:gallery-line' },
        { text: 'Post Encryption', link: 'encryption/', icon: 'ri:key-line' },
      ],
    },
  ],
})

export const enCollections = defineCollections([
  enGuideDoc,
])
