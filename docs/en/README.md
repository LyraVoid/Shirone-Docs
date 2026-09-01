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
      text: A minimalist & feature-rich Astro blog theme
      image: /icon.png

      actions:
        -
          theme: brand
          text: Get Started →
          link: /en/guide/intro/
        -
          theme: alt
          text: View on GitHub →
          link: https://github.com/LyraVoid/Shirone
  -
    type: features
    features:
      -
        title: Material 3 Expressive
        icon: material-symbols:palette-outline
        details: Deeply integrated with Google M3 design tokens, dynamic color mapping, and adaptive layouts.
        link: /en/guide/intro/
      -
        title: Native Content Separation
        icon: material-symbols:hub-outline
        details: Decouple posts and media into a standalone private repo with zero-conflict upstream updates.
        link: /en/guide/content-separation/concepts/
      -
        title: Client-Side Encryption
        icon: material-symbols:lock-outline
        details: Industrial-grade AES-256-GCM + PBKDF2 authentication encryption directly baked into static pages.
        link: /en/guide/writing/advanced/encryption/
      -
        title: Build & Font Optimization
        icon: material-symbols:speed-outline
        details: Built on Astro 7 + Vite 8 with automated CJK glyph extraction and subsetting for 80%+ smaller fonts.
        link: /en/guide/optimize-build/
      -
        title: Anime Tracker & Media
        icon: material-symbols:tv-guide-outline
        details: Native Bilibili / Bangumi tracking synchronization, Meting music player, and masonry photo albums.
        link: /en/guide/api/user/bangumi/
      -
        title: Rich Markdown Syntax
        icon: material-symbols:code-blocks-outline
        details: 15+ custom markdown extensions including file trees, code trees, markers, steps, and GitHub alerts.
        link: /en/guide/writing/markdown/basic/
      -
        title: Component Architecture
        icon: material-symbols:widgets-outline
        details: Atomic design component system covering atoms, molecules, organisms, navigation, and shell widgets.
        link: /en/guide/api/components/
      -
        title: Config Overlays & Data
        icon: material-symbols:tune-outline
        details: Declarative YAML overlay mechanism and TypeScript structured data entities with full type safety.
        link: /en/guide/content-separation/config-overlay/
      -
        title: Universal Cloud Deployment
        icon: material-symbols:cloud-done-outline
        details: Tailored workflows for Cloudflare Pages, Vercel, Tencent EdgeOne, Netlify, and standalone Docker.
        link: /en/guide/deploy/cloudflare/
---
