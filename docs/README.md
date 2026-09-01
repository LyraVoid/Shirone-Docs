---
pageLayout: home
externalLinkIcon: false
config:
  -
    type: doc-hero
    full: true
    background: tint-plate
    tintPlate: 180,230,228
    hero:
      name: Shirone
      tagline: Astro Next Theme
      text: 一个简约 & 功能丰富的 Astro 博客主题
      image: /favicon.svg

      actions:
        -
          theme: brand
          text: 快速上手 →
          link: /guide/intro/
        -
          theme: alt
          text: 在 GitHub 上查看 →
          link: https://github.com/LyraVoid/Shirone
  -
    type: features
    features:
      -
        title: Material 3 灵动设计
        icon: material-symbols:palette-outline
        details: 深度融入 Google Material Design 3 规范，具备动态色彩映射、平滑明暗过渡与精细排版。
        link: /guide/features/overview/
      -
        title: 原生内容分离架构
        icon: material-symbols:hub-outline
        details: 主题工程与博主内容完全解耦，支持私有内容仓与公开代码仓双仓协同，主题升级零冲突。
        link: /guide/content-separation/concepts/
      -
        title: 工业级客户端加密
        icon: material-symbols:lock-outline
        details: 基于 PBKDF2-SHA-256 与 AES-256-GCM 规范实现静态文章客户端高强度加密解密。
        link: /guide/writing/advanced/encryption/
      -
        title: 极致性能与字体裁剪
        icon: material-symbols:speed-outline
        details: 基于 Astro 5 + Vite 6 构建，全站中文字体按需提取子集裁剪，体积降低 80% 以上。
        link: /guide/optimize-build/
      -
        title: 多模态媒体与追番
        icon: material-symbols:tv-guide-outline
        details: 内置 Bilibili / Bangumi 追番追剧数据同步、侧栏 Meting 音乐播放器与瀑布流相册。
        link: /guide/features/bangumi-tracker/
      -
        title: 丰富 Markdown 语法
        icon: material-symbols:code-blocks-outline
        details: 原生集成文件树、代码树、马克笔高亮、步骤引导、GitHub 警报等 15+ 种扩展语法。
        link: /guide/writing/markdown/basic/
      -
        title: 毫秒级离线全文检索
        icon: material-symbols:search
        details: 采用轻量化 Pagefind WASM 纯离线检索方案，分块索引快速响应，零第三方服务依赖。
        link: /guide/features/pagefind-search/
      -
        title: 结构化数据与个人罗盘
        icon: material-symbols:devices-other-outline
        details: 开箱即用的开源项目、数码装备、技能图谱、大事记时间线与友链健康监测。
        link: /guide/features/overview/
      -
        title: 零配置开箱与多云部署
        icon: material-symbols:cloud-done-outline
        details: 完美适配 Cloudflare Pages、Vercel、腾讯云 EdgeOne、Netlify 及独立 Docker 容器。
        link: /guide/deploy/cloudflare-pages/
---
