---
title: About Page
createTime: 2026/09/01 00:30:00
permalink: /en/guide/pages/about/
---

The About page (`/about/`) is a full-length self-introduction—its content is a single Markdown file, with no behavior config switch.

## Content Location

```text
src/content/spec/about.md
```

## How to Edit

The first-line heading becomes the page title; the body supports all Markdown enhancements:

```markdown title="src/content/spec/about.md"
# About Me

I'm Shirone—I write code and words.

## Focus Areas

- Frontend engineering and design systems
- Static sites and content-driven architecture

## Contact

- GitHub: [my-github](https://github.com/yourname)
- Email: me@example.com
```

Rebuild after editing and the page is served at `/about/`.

## Recommended Structure

A good About page usually contains:

| Section | Content |
| --- | --- |
| Intro | One or two sentences: who you are, what you do |
| Focus areas | Interests/expertise, echoing the [Skills page](/en/guide/pages/skills/) |
| Highlights | Detailed experiences here; node-style summaries go to the Timeline |
| Contact | Email, social accounts |
| About this site | Tech stack (Astro/Svelte/M3E), why the site exists |

The sample file is a good template itself: a `::github` card for the repo and sectioned headings.

## All Enhancements Work

The About page renders as ordinary Markdown, meaning you can use:

- Admonitions and collapse panels (`::: collapse`)
- GitHub repo cards (`::github{repo="…"}`)
- Mermaid diagrams and KaTeX math
- Image galleries `:::grid` (great for a personal photo wall)

## FAQ

**About page vs. profileConfig**

`profileConfig` (avatar/name/bio) powers the sidebar card, footer, RSS author, and other global spots; the About page is the long-form introduction. They complement each other—the sidebar card links here.

**How to show it in the navigation**

A `About` preset (`/about/`) already exists in `LinkPresets`; reference it in `navBarConfig`'s `links` (mounted in the "More" group by default).

**Can I change the URL**

Yes—override `url` via a custom link (see [Navigation Bar](/en/guide/layout/navbar/)); the file path stays fixed at `src/content/spec/about.md`.
