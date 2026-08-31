import { defineClientConfig } from 'vuepress/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'

import './theme/styles/custom.css' // import your custom styles / 导入自定义样式

export default defineClientConfig({
  enhance({ app }) {
    // built-in components / 内置组件
    app.component('RepoCard', RepoCard)
  },
})
