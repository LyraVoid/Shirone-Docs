---
title: Get Started
permalink: /en/guide/get-started/
createTime: 2026/08/31 20:54:46
---

# Get Started

This page explains how to run and build this site locally.

## Requirements

- Node.js: `^20.19.0 || >=22.0.0`
- Package manager: pnpm (`packageManager` is pinned to `pnpm@11.17.0`)

## Install Dependencies

```sh
pnpm install
```

## Local Development

```sh
pnpm docs:dev
```

Visit the local address printed in the terminal (defaults to `http://localhost:8080/`). If you run into cache issues, use `pnpm docs:dev-clean` to start with a clean cache.

## Build & Preview

```sh
# build production static files
pnpm docs:build

# preview the build output locally
pnpm docs:preview
```

## Directory Structure

```
docs/
├── .vuepress/        # site config, theme customization, static assets
├── guide/            # doc collection: guides
└── README.md         # home page
```

::: collapse Available Scripts

| Script | Description |
| --- | --- |
| `pnpm docs:dev` | start the dev server |
| `pnpm docs:dev-clean` | start the dev server with a clean cache |
| `pnpm docs:build` | build production static files |
| `pnpm docs:preview` | preview the build output locally |
| `pnpm vp-update` | update VuePress and the theme |

:::
