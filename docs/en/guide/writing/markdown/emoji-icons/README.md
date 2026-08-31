---
title: Emojis & Icons
createTime: 2026/08/31 23:02:00
permalink: /en/guide/writing/markdown/emoji-icons/
---

Shirone provides first-class support for native Unicode emojis and modern vector icon libraries with crisp rendering and zero runtime bloat.

## Native Unicode Emojis

Shirone renders standard UTF-8 emojis directly without requiring translation packages or client-side image dictionaries:

- Input standard emojis directly in Markdown content, titles, or frontmatter metadata.
- Preserves native operating system glyph rendering across all devices.

## Vector Icon Integration

Shirone integrates seamlessly with the Iconify and Material Symbols ecosystem:

- Use standard icon identifiers (such as `ri:book-open-line`, `material-symbols:apps-rounded`, `fa6-brands:github`) in configs, navbar, widgets, and components.
- Icons are statically extracted during build time into lightweight inline SVGs.

## Finding Icons

Explore thousands of available icons at [icones.js.org](https://icones.js.org/).
