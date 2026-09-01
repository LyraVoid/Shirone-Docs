---
pageLayout: home
externalLinkIcon: false
config:
  -
    type: doc-hero
    full: true
    background: tint-plate
    tintPlate: 255,205,220
    hero:
      name: Shirone
      tagline: Astro Next Theme
      text: 一个简约 & 功能丰富的 Astro 博客主题
      image: /icon.png

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
        link: /guide/intro/
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
        details: 基于 Astro 7 + Vite 8 构建，全站中文字体按需提取子集裁剪，体积降低 80% 以上。
        link: /guide/optimize-build/
      -
        title: 追番同步与多模态
        icon: material-symbols:tv-guide-outline
        details: 内置 Bilibili / Bangumi 追番追剧数据同步、侧栏 Meting 音乐播放器与瀑布流相册。
        link: /guide/api/user/bangumi/
      -
        title: 丰富 Markdown 语法
        icon: material-symbols:code-blocks-outline
        details: 原生集成文件树、代码树、马克笔高亮、步骤引导、GitHub 警报等 15+ 种扩展语法。
        link: /guide/writing/markdown/basic/
      -
        title: 组件体系与外壳部件
        icon: material-symbols:widgets-outline
        details: 遵循 Atomic Design 架构的组件库，涵盖操作、展示、输入、导航及全局侧栏外壳。
        link: /guide/api/components/
      -
        title: 配置覆盖与数据解耦
        icon: material-symbols:tune-outline
        details: 采用声明式 YAML 覆盖机制与 TypeScript 结构化数据实体，兼具灵活性与类型安全。
        link: /guide/content-separation/config-overlay/
      -
        title: 零配置开箱与多云部署
        icon: material-symbols:cloud-done-outline
        details: 完美适配 Cloudflare Pages、Vercel、腾讯云 EdgeOne、Netlify 及独立 Docker 容器。
        link: /guide/deploy/cloudflare/
---
