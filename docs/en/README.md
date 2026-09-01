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
      text: A minimalist & feature-rich Astro blog theme
      image: /favicon.svg

      actions:
        -
          theme: brand
          text: Get Started →
          link: /en/guide/intro/
        -
          theme: alt
          text: View on GitHub →
          link: https://github.com/matsuzaka-yuki/Shirone
  -
    type: features
    features:
      -
        title: Material 3 Expressive
        icon: material-symbols:palette-outline
        details: Deeply integrated with Google M3 design tokens, dynamic color mapping, and adaptive layouts.
        link: /en/guide/features/overview/
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
        details: Built on Astro 5 + Vite 6 with automated CJK glyph extraction and subsetting for 80%+ smaller fonts.
        link: /en/guide/optimize-build/
      -
        title: Media & Anime Tracker
        icon: material-symbols:tv-guide-outline
        details: Native Bilibili / Bangumi tracking synchronization, Meting music player, and masonry photo albums.
        link: /en/guide/features/bangumi-tracker/
      -
        title: Rich Markdown Syntax
        icon: material-symbols:code-blocks-outline
        details: 15+ custom markdown extensions including file trees, code trees, markers, steps, and GitHub alerts.
        link: /en/guide/writing/markdown/basic/
      -
        title: Offline Full-Text Search
        icon: material-symbols:search
        details: Powered by Pagefind WASM for instant, low-latency offline chunked search without external APIs.
        link: /en/guide/features/pagefind-search/
      -
        title: Structured Data Showcase
        icon: material-symbols:devices-other-outline
        details: Out-of-the-box data managers for projects, hardware devices, skill graphs, and career milestones.
        link: /en/guide/features/overview/
      -
        title: Universal Cloud Deployment
        icon: material-symbols:cloud-done-outline
        details: Tailored workflows for Cloudflare Pages, Vercel, Tencent EdgeOne, Netlify, and standalone Docker.
        link: /en/guide/deploy/cloudflare-pages/
  -
    type: custom
---

## Quick Start in 1 Minute

Initialize your Shirone blog in seconds:

::: tabs
@tab pnpm (Recommended)
```bash
# 1. Clone official repository
git clone https://github.com/matsuzaka-yuki/Shirone.git my-blog

# 2. Navigate and install dependencies
cd my-blog
pnpm install

# 3. Launch local development server
pnpm dev
```

@tab One-Click Template (GitHub)
Visit [matsuzaka-yuki/Shirone](https://github.com/matsuzaka-yuki/Shirone) and click **Use this template** -> **Create a new repository** to fork directly to your account.
:::

---

## Architecture & Core Highlights

Shirone strikes a balance between **visual aesthetics**, **modern engineering**, and an **author-first workflow**:

- **Modern Frontend Stack**: Built on Astro 5 + Svelte 5 + Vite 6; static site generation ensures ultra-fast page loads with minimal client-side runtime;
- **Declarative Config Overlays**: Modular YAML configurations follow the minimal overlay principle to ensure clean, conflict-free upstream upgrades;
- **Full-Pipeline Asset Optimization**: Automated Chinese font (CJK) glyph extraction and pruning, local icon offline bundling, and multi-format image compression;
- **Pure Static & Security-First**: Zero server/database dependencies, Pagefind WASM offline full-text search, and Web Crypto client-side encryption.

