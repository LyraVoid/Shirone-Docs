---
title: Content Sources
createTime: 2026/11/03 16:00:00
permalink: /en/guide/content-separation/content-sources/
---

`pnpm content:sync` decides where content originates before each build. A single-repo setup needs no configuration. The dual-repo setup uses environment variables or a manifest file in the theme repo root.

## Resolution order

The system checks configurations in the following order and stops at the first match:

1. `SHIRONE_CONTENT_SYNC=0`: disables syncing and stays in single-repo mode.
2. `CONTENT_DIR`: path to a local content repository (used in preference to `CONTENT_REPO_URL` when both are set).
3. `CONTENT_REPO_URL`: Git URL of a remote content repository.
4. `source` declaration in `shirone.content.json` at the theme repo root.
5. None of the above: uses the content bundled with the theme.

Environment variable loading follows this priority order:

```text
process environment > .env.local > .env
```

`.env` and `.env.local` only affect local commands. Platform build machines do not read repository `.env` files; configure environment variables in the platform dashboard instead.

## Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `CONTENT_DIR` | Local content repo path | none |
| `CONTENT_REPO_URL` | Remote content repo URL | none |
| `CONTENT_REPO_REF` | Branch, tag, or commit SHA | `main` |
| `CONTENT_SYNC_PULL` | Set to `false` to reuse `.content-src/` without fetching | `true` |
| `SHIRONE_CONTENT_SYNC` | Set to `0`, `false`, `no`, or `off` to disable syncing | unset |
| `GIT_TERMINAL_PROMPT` | Set to `0` to prevent Git from prompting interactively | unset |

### CONTENT_DIR

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

Relative paths resolve from the theme repo root. This is standard for local preview, especially when paired with `pnpm content:watch`.

### CONTENT_REPO_URL

```ini title=".env"
CONTENT_REPO_URL="https://github.com/OWNER/shirone-content.git"
```

Private repositories require an access token in the URL:

```text
https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
```

The sync script automatically redacts credentials from logs. Even so, never commit URLs containing access tokens to public repositories.

### CONTENT_REPO_REF

When unset, the value defaults to `source.ref` in the manifest; if the manifest does not declare one, `main` is used. For reproducible builds, specify the full commit SHA rather than a short SHA or mutable branch name.

### CONTENT_SYNC_PULL

```ini title=".env"
CONTENT_SYNC_PULL="false"
```

When set to `false`, the command only reuses the existing local `.content-src/`.

::: warning
This requires the repository URL, ref, and commit SHA of `.content-src/` to match the current configuration exactly, and the working tree to have no uncommitted changes; otherwise the command aborts with an error.
:::

### SHIRONE_CONTENT_SYNC

Used to temporarily revert to single-repo mode to verify whether content source configuration causes build issues. When disabled, `CONTENT_DIR` and `CONTENT_REPO_URL` are ignored.

## Common scenarios

### Local preview

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

```bash
pnpm content:sync
pnpm dev
```

Detailed instructions are available in [Local Preview & Debugging](/en/guide/content-separation/local-preview/).

### GitHub Actions

The theme repo's `deploy.yml.example` checks the content repo out to `.content-src/`, then points `CONTENT_DIR` to it:

```yaml
env:
  CONTENT_DIR: .content-src
```

The checkout step uses `CONTENT_REPO_TOKEN`. That token is used exclusively for checkout; `content:sync` does not read it:

```yaml
- uses: actions/checkout@v4
  with:
    repository: OWNER/shirone-content
    ref: ${{ github.event.client_payload.sha || 'main' }}
    path: .content-src
    token: ${{ secrets.CONTENT_REPO_TOKEN }}
    persist-credentials: false
```

### Cloudflare Pages / Vercel / EdgeOne / Netlify

Platform build machines clone only the theme repo and cannot check out a second repository directly, so use `CONTENT_REPO_URL`:

```text
CONTENT_REPO_URL=https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

The platform runs `pnpm build`, which already includes the content sync. Do not prepend `pnpm content:sync &&`.

## Manifest

`shirone.content.json` in the theme repo root is an optional configuration file that fixes content source settings. A template is provided at `shirone.content.example.json`; copy and rename it:

```json title="shirone.content.json"
{
  "schemaVersion": 1,
  "source": {
    "type": "git",
    "url": "https://github.com/OWNER/shirone-content.git",
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

| Field | Purpose |
| --- | --- |
| `schemaVersion` | Manifest schema version, currently `1` |
| `source.type` | `path` for a local directory or `git` for a remote repository |
| `source.path` | Local directory, relative to the theme repo root |
| `source.url` / `source.ref` | Remote repository URL and corresponding branch, tag, or commit SHA |
| `mounts` | Mount mappings. Set a value to `null` to disable that mount point |
| `keep` | Whitelisted files excluded from pruning; supports `*` and `**` |
| `prune` | Set to `false` to copy incrementally without deleting removed files |

Running `pnpm content:eject` generates this file automatically.

The content repo also contains a `shirone.content.json` file, but it only records repository metadata and is never read during builds. To modify content source configuration, update the manifest file in the theme repo.

## Private repositories and tokens

- The token only requires `Contents: Read` on the content repo, with no permissions needed on the theme repo.
- URLs with tokens must use HTTPS. SSH requires pre-configured private keys on build machines, which most static hosting platforms do not support.
- Expired or revoked tokens, or tokens lacking content repo access, produce `Authentication failed` errors in build logs.
- Never commit `.env`, token strings, or URLs containing tokens to public repositories.

For token creation steps, see [Access Tokens](/en/guide/content-separation/pat/).

Public content repositories do not require a token. Use `https://github.com/OWNER/REPO.git` directly.

## FAQ

::: collapse
- `CONTENT_REPO_URL` is set, but the build still uses theme-bundled content

  Check whether `CONTENT_DIR` is also configured; it has higher priority.

  Also confirm the variable is set in the hosting platform's build environment, not just locally in `.env`.

- Content repo updated, but the build still produces older content

  Verify whether `CONTENT_REPO_REF` is pinned to an older branch or commit SHA.

  Platform build caches may also retain a stale `.content-src/`; clear the cache and trigger a new build.

- `CONTENT_SYNC_PULL=false` fails

  This mode requires `.content-src/` to match the active URL, ref, and commit SHA exactly, with a clean working copy.

  Run a standard sync first, or delete `.content-src/` and rebuild.

- The repository URL contains special characters

  URLs containing access tokens must be URL-encoded.

  Prefer the `x-access-token:<TOKEN>` format to avoid special characters in username or password fields.
:::

## Next steps

[Configuration Overlay](/en/guide/content-separation/config-overlay/): customize site title, navigation, sidebar, and more from the content repo.

## Related pages

- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/)
- [Deployment Hooks](/en/guide/content-separation/deploy-hooks/)
- [CLI Toolchain](/en/guide/content-separation/cli-workflows/)
