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
        { text: 'Frontmatter 与文章管理', link: 'frontmatter/', icon: 'ri:file-list-3-line' },
      ],
    },
    {
      text: '基础布局',
      icon: 'ri:layout-2-line',
      prefix: '/guide/layout/',
      collapsed: true,
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
      text: '写作',
      icon: 'ri:quill-pen-line',
      prefix: '/guide/writing/',
      collapsed: false,
      items: [
        {
          text: 'markdown',
          icon: 'ri:markdown-line',
          prefix: 'markdown/',
          collapsed: false,
          items: [
            { text: '基础语法', link: 'basic/', icon: 'ri:text' },
            { text: '扩展与属性', link: 'attributes/', icon: 'ri:code-s-line' },
            { text: '原生表情与图标', link: 'emoji-icons/', icon: 'ri:emotion-line' },
            { text: '数学公式', link: 'math/', icon: 'ri:functions' },
            { text: '响应式表格', link: 'table/', icon: 'ri:table-line', badge: { type: 'warning', text: '新' } },
            { text: '马克笔高亮', link: 'marker/', icon: 'ri:mark-pen-line' },
            { text: '隐秘文本', link: 'spoiler/', icon: 'ri:eye-close-line' },
            { text: '缩写词悬浮', link: 'abbreviations/', icon: 'ri:chat-quote-line' },
            { text: '内容注释', link: 'annotations/', icon: 'ri:chat-new-line' },
            { text: '提示容器', link: 'admonitions/', icon: 'ri:notification-line' },
            { text: 'Github 警报', link: 'github-alerts/', icon: 'ri:alarm-warning-line' },
            { text: '卡片与字段组', link: 'cards/', icon: 'ri:id-card-line' },
            { text: '步骤引导', link: 'steps/', icon: 'ri:list-ordered' },
            { text: '文件树', link: 'file-tree/', icon: 'ri:node-tree' },
            { text: '代码树', link: 'code-tree/', icon: 'ri:file-code-line', badge: { type: 'warning', text: '新' } },
            { text: '代码选项组', link: 'tabs/', icon: 'material-symbols:tab-outline-rounded', badge: { type: 'warning', text: '新' } },
            { text: '图片画廊与排版', link: 'image-grid/', icon: 'ri:image-line' },
            { text: '文件片段导入', link: 'include/', icon: 'ri:file-copy-2-line' },
          ],
        },
        {
          text: '代码块',
          icon: 'ri:code-box-line',
          prefix: 'codeblock/',
          collapsed: false,
          items: [
            { text: '语法高亮与行号', link: 'highlight/', icon: 'ri:code-line' },
            { text: '标题与文件名', link: 'titles/', icon: 'ri:file-text-line' },
            { text: '高亮与差异标记', link: 'diff/', icon: 'ri:focus-mode' },
            { text: '代码折叠与复制', link: 'collapse/', icon: 'ri:file-copy-line' },
            { text: '代码选项组', link: 'tabs/', icon: 'material-symbols:tab-outline-rounded' },
          ],
        },
        {
          text: '图表',
          icon: 'ri:line-chart-line',
          prefix: 'charts/',
          collapsed: true,
          items: [
            { text: 'Mermaid 图表', link: 'mermaid/', icon: 'ri:node-tree' },
          ],
        },
        {
          text: '资源嵌入',
          icon: 'ri:video-line',
          prefix: 'media/',
          collapsed: true,
          items: [
            { text: 'Bilibili 视频', link: 'bilibili/', icon: 'ri:bilibili-line' },
            { text: 'YouTube 视频', link: 'youtube/', icon: 'ri:youtube-line' },
            { text: 'AcFun 视频', link: 'acfun/', icon: 'ri:video-line' },
            { text: 'ArtPlayer 播放器', link: 'artplayer/', icon: 'ri:play-line' },
            { text: '音频朗读条', link: 'audio/', icon: 'ri:voiceprint-line' },
          ],
        },
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
        { text: 'Frontmatter & Post Management', link: 'frontmatter/', icon: 'ri:file-list-3-line' },
      ],
    },
    {
      text: 'Basic Layout',
      icon: 'ri:layout-2-line',
      prefix: '/en/guide/layout/',
      collapsed: true,
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
      icon: 'ri:quill-pen-line',
      prefix: '/en/guide/writing/',
      collapsed: false,
      items: [
        {
          text: 'Markdown',
          icon: 'ri:markdown-line',
          prefix: 'markdown/',
          collapsed: false,
          items: [
            { text: 'Basic Syntax', link: 'basic/', icon: 'ri:text' },
            { text: 'Attributes & Directives', link: 'attributes/', icon: 'ri:code-s-line' },
            { text: 'Emojis & Icons', link: 'emoji-icons/', icon: 'ri:emotion-line' },
            { text: 'Math & Formulas', link: 'math/', icon: 'ri:functions' },
            { text: 'Responsive Tables', link: 'table/', icon: 'ri:table-line', badge: { type: 'warning', text: 'New' } },
            { text: 'Marker Highlights', link: 'marker/', icon: 'ri:mark-pen-line' },
            { text: 'Inline Spoiler', link: 'spoiler/', icon: 'ri:eye-close-line' },
            { text: 'Abbreviations', link: 'abbreviations/', icon: 'ri:chat-quote-line' },
            { text: 'Content Annotations', link: 'annotations/', icon: 'ri:chat-new-line' },
            { text: 'Admonition Containers', link: 'admonitions/', icon: 'ri:notification-line' },
            { text: 'GitHub Alerts', link: 'github-alerts/', icon: 'ri:alarm-warning-line' },
            { text: 'Cards & Fields', link: 'cards/', icon: 'ri:id-card-line' },
            { text: 'Step Guides', link: 'steps/', icon: 'ri:list-ordered' },
            { text: 'File Tree', link: 'file-tree/', icon: 'ri:node-tree' },
            { text: 'Code Tree', link: 'code-tree/', icon: 'ri:file-code-line', badge: { type: 'warning', text: 'New' } },
            { text: 'Code Tabs', link: 'tabs/', icon: 'material-symbols:tab-outline-rounded', badge: { type: 'warning', text: 'New' } },
            { text: 'Image Grid & Media', link: 'image-grid/', icon: 'ri:image-line' },
            { text: 'File Include', link: 'include/', icon: 'ri:file-copy-2-line' },
          ],
        },
        {
          text: 'Code Blocks',
          icon: 'ri:code-box-line',
          prefix: 'codeblock/',
          collapsed: false,
          items: [
            { text: 'Syntax Highlighting', link: 'highlight/', icon: 'ri:code-line' },
            { text: 'Titles & File Names', link: 'titles/', icon: 'ri:file-text-line' },
            { text: 'Highlights & Diffs', link: 'diff/', icon: 'ri:focus-mode' },
            { text: 'Collapsing & Copying', link: 'collapse/', icon: 'ri:file-copy-line' },
            { text: 'Code Tabs', link: 'tabs/', icon: 'material-symbols:tab-outline-rounded' },
          ],
        },
        {
          text: 'Charts',
          icon: 'ri:line-chart-line',
          prefix: 'charts/',
          collapsed: true,
          items: [
            { text: 'Mermaid Diagrams', link: 'mermaid/', icon: 'ri:node-tree' },
          ],
        },
        {
          text: 'Media Embeds',
          icon: 'ri:video-line',
          prefix: 'media/',
          collapsed: true,
          items: [
            { text: 'Bilibili Video', link: 'bilibili/', icon: 'ri:bilibili-line' },
            { text: 'YouTube Video', link: 'youtube/', icon: 'ri:youtube-line' },
            { text: 'AcFun Video', link: 'acfun/', icon: 'ri:video-line' },
            { text: 'ArtPlayer Player', link: 'artplayer/', icon: 'ri:play-line' },
            { text: 'Audio Reader', link: 'audio/', icon: 'ri:voiceprint-line' },
          ],
        },
      ],
    },
  ],
})

export const enCollections = defineCollections([
  enGuideDoc,
])
