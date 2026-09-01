# Shirone Docs

[简体中文](./README.zh-CN.md)

The bilingual documentation repository for [Shirone](https://github.com/LyraVoid/Shirone), an Astro blog theme. It is built with VuePress and VuePress Theme Plume.

## Contents

- Getting started, project structure, deployment, and troubleshooting
- Content authoring, Frontmatter, Markdown extensions, media, permalinks, and encrypted posts
- Layout, page, widget, and feature configuration
- Content-separation workflows, API integrations, component contracts, and development guides
- Chinese source pages under `docs/` and matching English pages under `docs/en/`

## Requirements

- Node.js `^20.19.0` or `>=22.0.0`
- pnpm `11.17.0` (declared in `package.json`)

## Local Development

```bash
corepack enable
pnpm install
pnpm docs:dev
```

Open the local address printed by VuePress. On Windows systems where PowerShell blocks script execution, use `pnpm.cmd` instead.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm docs:dev` | Start the documentation development server |
| `pnpm docs:dev-clean` | Start the server after clearing VuePress caches |
| `pnpm docs:build` | Build the production site into `docs/.vuepress/dist/` |
| `pnpm docs:preview` | Serve the production build locally |
| `pnpm vp-update` | Update VuePress and Theme Plume dependencies |

## Repository Layout

```text
docs/
  .vuepress/                 VuePress and navigation configuration
  guide/                     Simplified Chinese documentation
  en/guide/                  English documentation
  README.md                  Chinese documentation-site home page
  en/README.md               English documentation-site home page
research/Shirone/            Local source reference, excluded from Git
```

## Writing Documentation

1. Create a directory for the page and add `README.md` beneath the appropriate locale.
2. Add frontmatter with `title`, `createTime`, and a stable `permalink`.
3. Keep Chinese and English pages aligned when the topic is user-facing.
4. Register the page in `docs/.vuepress/collections.ts`; pages are not discovered by navigation automatically.
5. Verify the result before submitting:

```bash
pnpm docs:build
```

Technical behavior, paths, configuration keys, and commands should be checked against the Shirone source rather than inferred from examples.

## License

[MIT](./LICENSE)
