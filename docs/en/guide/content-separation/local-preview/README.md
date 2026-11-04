---
title: Local Preview and Debugging
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/local-preview/
---

In the dual-repo setup, the theme repo builds and renders the site, while the content repo manages posts and configuration. Local preview requires pointing the theme repo to your content repo path.

## Before you start

Confirm two prerequisites:

1. Dependencies are installed in the theme repo (`pnpm install`).
2. The content repo exists locally on your machine.

If the content repo was created with `content:eject`, `shirone.content.json` in the theme repo already points to it. You can skip directly to [Start the preview](#start-the-preview).

Otherwise, specify the path using one of two methods:

- Set an environment variable in your terminal session.
- Create `.env` in the theme repo root for persistent local preview.

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

Relative paths in `CONTENT_DIR` resolve from the theme repo root. Absolute paths are also supported.

## Start the preview

### Option 1: sync once, then start

Suitable when you only need to inspect pages without making frequent file modifications.

::: tabs
@tab Windows (PowerShell)
```powershell
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd content:sync
pnpm.cmd dev
```
@tab Linux / macOS
```bash
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm content:sync
pnpm dev
```
:::

When the terminal prints `Local http://localhost:4321/`, open that address in your browser.

`content:sync` copies files from the content repo into `src/content/`, `src/data/`, `src/assets/`, and `public/`, then generates the configuration bridge at `src/user/user-config.ts`.

### Option 2: write and preview at the same time

Suitable when continuously writing posts or adjusting YAML configurations. Open two terminal windows in the theme repo:

::: tabs
@tab Windows (PowerShell)
```powershell
# Terminal 1
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd dev

# Terminal 2
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd content:watch
```
@tab Linux / macOS
```bash
# Terminal 1
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm dev

# Terminal 2
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm content:watch
```
:::

Saving a file in your Markdown editor prompts `content:watch` to sync changes, and the browser reloads automatically. When `.env` is configured, neither terminal requires `CONTENT_DIR`.

## Check the content source

When you are unsure which repository is currently active:

```bash
pnpm content:status
```

The output lists the active content source, the resolved commit SHA, and the overridden configuration files. Add `--remote` to verify the remote branch over the network.

## Common problems

::: collapse
- The content directory does not exist

  Check that `CONTENT_DIR` points to an existing directory containing `content/` or `config/`. Quote paths containing spaces.

- A configuration change has no effect

  Run `pnpm content:validate` to detect misspelled YAML fields. Array fields are replaced entirely; adding only a new item will not merge. See [Configuration Overlay](/en/guide/content-separation/config-overlay/).

- A new image does not appear

  Place images in `assets/` or `public/` in the content repo. If adding files deep within directory trees, run `pnpm content:sync` again.

- `config/anime.yaml` has no data

  Editing YAML does not fetch remote data automatically. Run `pnpm anime:sync --if-stale` in the theme repo, then preview again. Use `pnpm anime:sync` for first-time setup or forced refreshes. See [Anime Page](/en/guide/pages/anime/).
:::

## Next steps

[Content Sources](/en/guide/content-separation/content-sources/): resolution priority for local paths, remote repositories, and manifest files.
