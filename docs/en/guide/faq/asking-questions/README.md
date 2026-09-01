---
title: Asking & Feedback
createTime: 2026/09/01 01:01:00
permalink: /en/guide/faq/asking-questions/
---

Before filing an Issue or joining a discussion in the theme repository, read this page—a reproducible, information-complete report lets maintainers locate the problem in minutes; "it doesn't work" or "there's a bug" helps no one.

## Pre-Question Checklist

- [ ] Read the relevant doc pages on this site and their FAQs
- [ ] Worked through the universal tools in [Troubleshooting](/en/guide/faq/troubleshooting/)
- [ ] Confirmed the theme is up to date (try updating to the latest version first)
- [ ] The issue reproduces in a clean environment (fresh clone + minimal changes)

## What Issues Are Welcome

From the theme repository's CONTRIBUTING.md:

- **Reproducible bug reports**
- Documentation and translation improvements
- Accessibility, responsive layout, and browser compatibility fixes
- Tests for existing behavior
- Feature proposals that fit Shirone's direction as an expressive, content-focused blog theme

## What Doesn't Belong in an Issue

- Requests that only swap demo profile, posts, links, or artwork for one personal site—keep them in your own fork
- Large features, visual redesigns, breaking config changes, new dependencies, or third-party integrations—**open an Issue or Discussion first** to align on direction before implementing
- "Fix my blog for me" requests—the community can point you in the right direction but won't do personal customization

## How to Report a Bug Properly

A high-quality bug report includes:

::: steps

1. **Title**: one line summarizing the symptom (e.g. "Build fails with PBKDF2-related errors after enabling comments")
2. **Environment**: Node version, pnpm version, OS, theme version/commit
3. **Reproduction steps**: from a clean state to triggering the problem, every step
4. **Expected vs. actual**: what should happen, what actually happened
5. **Logs**: the complete error output (not just a screenshot fragment), with the lines you think matter marked
6. **Minimal reproduction**: the smallest config/content snippet that triggers it

:::

## Before Submitting a PR

If you plan to contribute code directly (welcome!), follow the theme repo's CONTRIBUTING.md:

**Mandatory before committing**:

```bash
pnpm format          # Biome formatting (required)
npx astro check      # must report zero errors
pnpm type-check      # when touching TS or shared APIs
pnpm build           # for content processing, fonts, and schemas
```

**Commit messages**: use [Conventional Commits](https://www.conventionalcommits.org/) with a concise English subject:

```text
feat(search): add result filters
fix(sidebar): sync widgets after navigation
docs(config): clarify music provider setup
```

**PR description** should explain: what problem it solves, how behavior changed, which commands verified it, whether it affects config/accessibility/performance/existing content, and which Issue it closes. For visual changes, include before/after screenshots and note the tested viewport and theme.

**Scope discipline**: one clear topic per PR; no unrelated formatting or visual changes; build output, test reports, local env files, credentials, and unrelated personal content stay out of the repository.

## Channels

- **Bugs & features**: [GitHub Issues](https://github.com/LyraVoid/Shirone/issues)
- **Direction discussions**: GitHub Discussions (open large changes here first)
- **Doc issues**: this site's repository, or flag them alongside an Issue

## FAQ

::: collapse
- My Issue got no response

  Check whether it's missing reproduction info—maintainers prioritize complete, reproducible reports. Adding environment details and logs often revives it.

- I'd like to contribute translations

  UI text goes through the i18n system; new keys must be filled in for all 10 language modules under `src/i18n/languages/`. Doc translations should keep commands, paths, links, and technical meaning accurate.

- My feature proposal was rejected

  The theme has a clear direction (expressive, content-first, zero overhead). Rejection doesn't mean the idea is bad—perhaps it doesn't fit; consider a community plugin or your own fork.
:::
