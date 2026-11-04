---
title: Local Preview and Debugging
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/local-preview/
---

In a dual-repo setup, the theme repo handles building and rendering, while the content repo manages articles and configuration.

Local previewing requires pointing the theme repo to your content repo directory.

## Prerequisites

Verify that the following two prerequisites are met:

1. Dependencies are installed in the theme repo (`pnpm install`);
2. The content repo exists on your local disk.

If the content repo was generated via `content:eject`, `shirone.content.json` in the theme root already records this path, and you can jump straight to [Start the preview](#start-the-preview).

Otherwise, specify the content repo path. Creating a `.env` file in the theme root is recommended for daily local development:

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

Relative paths in `CONTENT_DIR` resolve from the theme repo root. Absolute paths are also supported.

Alternatively, set the environment variable temporarily in your terminal without creating a `.env` file:

::: tabs
@tab Windows (PowerShell)
```powershell
$env:CONTENT_DIR = "D:\Code\my-blog-content"
```
@tab Linux / macOS
```bash
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
```
:::

![Set the content repo path and run the sync](/images/content-separation/01-quickstart/03-preview/01-local-preview-content.png)

## Start the preview

Run the dev server command from the theme repository root:

```bash
pnpm dev
```

Before starting the server, `pnpm dev` automatically performs a content sync (`content:sync`), copying posts, assets, and data into the theme workspace and generating `src/user/user-config.ts`.

When the terminal prints `Local http://localhost:4321/`, open that address in your browser to view your blog:

![Terminal output after the dev server starts](/images/content-separation/01-quickstart/03-preview/02-local-preview-terminal.png)

![Local browser preview](/images/content-separation/01-quickstart/03-preview/03-local-preview-browser.png)

## Write and preview simultaneously (Live Watcher)

When actively drafting articles or fine-tuning YAML configuration files, use the `content:watch` script command to enable continuous synchronization without restarting the dev server manually.

Keep two terminal tabs open in the theme repository:

1. **Terminal 1 (Preview Server)**: Run `pnpm dev` to keep the local site running;
2. **Terminal 2 (Live Watcher)**: Run `pnpm content:watch` to monitor content file changes.

```bash
# In Terminal 2
pnpm content:watch
```

**How it works**:
Saving any Markdown article or YAML configuration in your editor triggers `content:watch` to immediately synchronize changes into the theme workspace. Astro hot-reloads automatically, updating the browser view in seconds.

::: tip Environment variable inheritance
When `CONTENT_DIR` is stored in `.env`, both terminal windows automatically detect it, so you never need to re-export the path in each terminal session.
:::

## Check the content source

When verifying which content repository is currently active, run the status diagnostic command in the theme root:

```bash
pnpm content:status
```

The command reports the current content source type, resolved commit SHA, and active configuration files.

To check if a remote branch has new commits, pass the `--remote` flag to run a network check.

## Troubleshooting

::: collapse
- Error: Content directory not found

  Verify that the path in `CONTENT_DIR` exists and contains `content/` or `config/` folders. Wrap paths with quotes if they contain spaces.

- Configuration updated but changes do not appear

  Run `pnpm content:validate` to check for misspelled YAML keys.

  Array properties use a full replacement strategy. To add an item, you must declare the complete list of elements. See [Configuration Overlays](/en/guide/content-separation/config-overlay/).

- Newly added images do not display

  Place image assets under `assets/` or `public/` in your content repository. After adding deeply nested assets, running `pnpm content:sync` manually can help verify file placement.

- Anime tracking page missing data after modifying config/anime.yaml

  Editing the YAML does not automatically download remote data. Run `pnpm anime:sync --if-stale` in the theme repo to fetch watch lists and cover assets.

  For initial setup or force refresh, run `pnpm anime:sync`. See the [Anime Page](/en/guide/pages/anime/).
:::

## Next steps

- [Content Sources](/en/guide/content-separation/content-sources/): Learn resolution precedence across local paths, remote repos, and manifest files
- [Configuration Overlays](/en/guide/content-separation/config-overlay/): Customize blog title, navigation, and sidebar from the content repo
