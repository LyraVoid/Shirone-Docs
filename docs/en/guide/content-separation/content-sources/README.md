---
title: Content Sources
createTime: 2026/11/03 16:00:00
permalink: /en/guide/content-separation/content-sources/
---

In a separated repository architecture, blog theme code resides in the theme code repository, while all posts, configurations, and images live in an independent content repository.

Before running a build or local preview, Shirone needs to know where to find these files. A "content source" specifies where Shirone retrieves your posts and configuration files.

## Two Core Content Source Types

Depending on your workflow, content sources are configured as either a **local directory** or a **remote Git repository**:

### 1. Local Directory (for Local Writing and Live Preview)

When writing on your computer, you typically clone the content repo alongside the theme code repo in adjacent folders. Set `CONTENT_DIR` to point to the local content directory:

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

- **Path details**: Supports relative or absolute paths. Relative paths resolve from the theme code repo root;
- **Interactive workflow**: When paired with `pnpm content:watch`, edits saved in your local editor automatically sync to your blog preview without needing manual Git pushes or network requests.

### 2. Remote Git Repository (for Cloud Automated Builds)

When deploying to hosting platforms (Cloudflare Pages, Vercel, EdgeOne, Netlify), the platform's build machine only clones the theme code repo. You must provide `CONTENT_REPO_URL` so the build runner can automatically pull your content repo during the build:

```ini title="Platform Environment Variables"
CONTENT_REPO_URL=https://github.com/USERNAME/CONTENT_REPO.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

Key environment variables for remote content sources:

| Variable | Required | Description |
| --- | --- | --- |
| `CONTENT_REPO_URL` | Yes | Git URL of your remote content repository (see formats below) |
| `CONTENT_REPO_REF` | No | Target branch, tag, or commit SHA; defaults to `main` |
| `GIT_TERMINAL_PROMPT` | Yes | Always set to `0` to prevent Git from waiting indefinitely on password prompts during cloud builds |

**Public vs. Private Repository Format**:

- **Public content repository**: Use the standard HTTPS clone URL:
  ```text
  https://github.com/USERNAME/CONTENT_REPO.git
  ```
- **Private content repository**: Embed a Personal Access Token with read permissions directly in the URL:
  ```text
  https://x-access-token:<YOUR_TOKEN>@github.com/USERNAME/CONTENT_REPO.git
  ```
  The token only requires `Contents: Read` access on the content repository. The sync script automatically redacts credentials from build logs, but never commit URLs containing tokens to public repositories or commit history. See [Personal Access Tokens](/en/guide/content-separation/pat/) for setup details.

## Where to Configure Variables

Configuration locations depend on the environment:

| Environment | Where to Configure | Description |
| --- | --- | --- |
| Local development & preview | `.env` or `.env.local` in theme root | Only loaded by local terminal commands; never committed to production |
| Cloud hosting platforms | Platform dashboard (Environment Variables) | Cloud build runners do not read your local `.env` files; variables must be set in the platform console |
| GitHub Actions | Repo Settings -> Secrets / Variables | Injected into workflow steps via `env:` |

Variable loading priority: `System/Process environment` > `.env.local` > `.env`.

## Resolution Order

When multiple content source configurations exist simultaneously, Shirone evaluates them in the following order and stops at the first valid match:

1. **`SHIRONE_CONTENT_SYNC=0`**: Disables synchronization entirely and falls back to theme built-in sample content. Useful for isolating build issues;
2. **`CONTENT_DIR`**: If a local directory is defined and exists, it takes precedence (even if `CONTENT_REPO_URL` is also set);
3. **`CONTENT_REPO_URL`**: Pulls content from the remote Git repository into the temporary `.content-src/` directory;
4. **`source` in `shirone.content.json`**: Reads declarations in the theme root manifest file;
5. **Theme bundled content**: Used when none of the above configurations match.

## Advanced Control Variables

For specific debugging or offline scenarios, additional control flags are available:

| Variable | Values | Description |
| --- | --- | --- |
| `CONTENT_SYNC_PULL` | `false` / `true` (default) | When `false`, reuses the existing `.content-src/` directory without fetching over the network. Requires the directory to match the target URL and ref cleanly |
| `SHIRONE_CONTENT_SYNC` | `0` / `false` / `off` | Completely disables synchronization logic |

## Manifest File (shirone.content.json)

The optional `shirone.content.json` file in the theme root allows you to hardcode default content source parameters inside the repository. A template is provided at `shirone.content.example.json`:

```json title="shirone.content.json"
{
  "schemaVersion": 1,
  "source": {
    "type": "git",
    "url": "https://github.com/USERNAME/CONTENT_REPO.git",
    "ref": "main"
  },
  "mounts": {
    "content": "src/content",
    "data": "src/data",
    "assets": "src/assets",
    "public": "public"
  },
  "keep": [],
  "prune": true
}
```

Field summary:

- **`source`**: Declares the default source. `type` can be `path` (local directory) or `git` (remote repository);
- **`mounts`**: Defines directory mapping between the content repo and the theme workspace;
- **`keep`**: File pattern whitelist protected from cleanup during synchronization;
- **`prune`**: Whether to remove obsolete theme files not present in the content repo (defaults to `true`).

::: tip Distinguish theme repo and content repo manifests
The content repo root also contains a `shirone.content.json`, but that file only tracks content repo metadata. The build system reads the manifest from the **theme code repository**.
:::

## Troubleshooting

::: collapse
- Configured CONTENT_REPO_URL, but build still uses sample content?

  Check if `CONTENT_DIR` is also set locally or in environment variables. Local directory configurations take priority whenever the directory exists.

  For cloud hosting platforms, ensure variables are added in the platform's Environment Variables settings rather than in a local `.env` file.

- Pushed new articles, but the deployed site still shows older content?

  Check if `CONTENT_REPO_REF` is locked to an outdated commit SHA or an inactive branch.

  If settings are correct, the platform's build machine may have cached the temporary `.content-src/` directory. Clear the build cache in the platform dashboard and rebuild.

- Build fails with Authentication failed on private repository?

  Verify that the personal access token in `CONTENT_REPO_URL` has not expired and has `Contents: Read` permission enabled.
:::

## Next steps

- [Configuration Overlays](/en/guide/content-separation/config-overlay/): Customize site title, navigation, and sidebar from the content repo
- [Local Preview](/en/guide/content-separation/local-preview/): Set up live preview while writing locally
- [CLI Workflows](/en/guide/content-separation/cli-workflows/): Learn sync and status inspection commands
