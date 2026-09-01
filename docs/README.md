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
  -
    type: custom
---

## 1 分钟快速起步

通过官方模板快速初始化你的 Shirone 博客：

::: tabs
@tab pnpm (推荐)
```bash
# 1. 克隆官方代码仓库
git clone https://github.com/LyraVoid/Shirone.git my-blog

# 2. 进入目录并安装依赖
cd my-blog
pnpm install

# 3. 启动本地开发预览
pnpm dev
```

@tab 模板一键创建 (GitHub)
前往 [matsuzaka-yuki/Shirone](https://github.com/LyraVoid/Shirone) 点击右上角 **Use this template** -> **Create a new repository** 即可直接分叉至个人 GitHub 账号。
:::

---

## 架构特性与设计亮点

Shirone 致力于在**视觉美学**、**工程架构**与**写作体验**之间取得平衡：

- **现代化前端技术栈**：基于 Astro 5 + Svelte 5 + Vite 6 构建，静态生成（SSG）保障极速加载，局部 Islands 架构实现零多余客户端 JavaScript；
- **声明式配置解耦**：全站配置按功能领域拆分为轻量 YAML 文件，遵循最小化覆盖原则，升级主题时绝不产生 Git 配置冲突；
- **全链路资产优化**：构建期自动提取页面字形进行中文字体（CJK）精准子集化裁剪，图标自动离线打包，图片多规格压缩；
- **纯静态高安全设计**：无服务端数据库依赖，Pagefind WASM 毫秒级离线全文检索，配合 Web Crypto 工业级文章加密保护隐私。

