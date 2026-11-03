---
title: Content Sources and Environment Variables
createTime: 2026/11/03 16:00:00
permalink: /en/guide/content-separation/content-sources/
---

`pnpm content:sync` decides where content comes from before the build starts. Single-repo setups need no configuration. Dual-repo setups use environment variables or the content repo's `shirone.content.json` to point at a source.

This page covers source precedence, variable meanings, and the common setups. Platform-specific build settings stay in [Cloud Deploy Hook Integrations](/en/guide/content-separation/deploy-hooks/).

## Precedence

Content sources are resolved in this order. The first available source wins:

1. `SHIRONE_CONTENT_SYNC=0`: disable sync and return to single-repo mode
2. `CONTENT_DIR`: local content repo path
3. `CONTENT_REPO_URL`: remote Git content repo URL
4. `source` in `shirone.content.json`
5. None of the above: use the content bundled with the theme repo

`CONTENT_DIR` takes precedence over `CONTENT_REPO_URL`. If a local content checkout is configured, it is used even when a remote URL is also present.

Environment variable sources also have an order:

```text
process environment > .env.local > .env
```

`.env` and `.env.local` only affect local commands and scripts that read them. Platform builders do not read these files from the repo; configure variables in the platform dashboard instead.

## Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `CONTENT_DIR` | Local content repo path, useful for local preview and debugging | None |
| `CONTENT_REPO_URL` | Git URL of the remote content repo | None |
| `CONTENT_REPO_REF` | Branch, tag, or commit SHA in the content repo | `main` |
| `CONTENT_SYNC_PULL` | Set to `false` to reuse `.content-src/` without fetching | `true` |
| `SHIRONE_CONTENT_SYNC` | Set to `0`, `false`, `off`, or `no` to disable sync | Unset |
| `GIT_TERMINAL_PROMPT` | Set to `0` to stop Git from waiting for terminal input | Unset |

### CONTENT_DIR

Points to a content repo already cloned locally:

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

Relative paths are resolved from the theme repo root. This works well with `pnpm content:watch`, so you do not need to fetch the remote repo while writing.

### CONTENT_REPO_URL

Points to the remote content repo, usually for a platform builder:

```ini title=".env"
CONTENT_REPO_URL="https://github.com/OWNER/shirone-content.git"
```

Private repos need a token in the URL:

```text
https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
```

The sync script hides credentials in log output. Even so, do not put a token-bearing URL in repository files, build scripts, or example configs.

### CONTENT_REPO_REF

Selects a branch, tag, or commit SHA in the content repo:

```ini title=".env"
CONTENT_REPO_REF="main"
```

When unset, it defaults to `main`; if the content repo's `shirone.content.json` declares `source.ref`, that value is used. `CONTENT_REPO_REF` applies to both `CONTENT_REPO_URL` and a Git source declared in the manifest.

For an exact build, use the full commit SHA, not a short SHA or a branch name.

### CONTENT_SYNC_PULL

Remote content is fetched by default. Set this to `false` to reuse the existing `.content-src/`:

```ini title=".env"
CONTENT_SYNC_PULL="false"
```

The working copy must match the current URL, ref, and commit, and must have no uncommitted changes. If it does not match, the command fails instead of fetching silently.

### SHIRONE_CONTENT_SYNC

Temporarily disables dual-repo sync:

```ini title=".env"
SHIRONE_CONTENT_SYNC="0"
```

Use it when checking whether the content source is configured correctly, or when you need to verify behavior in single-repo mode. Once disabled, `CONTENT_DIR` and `CONTENT_REPO_URL` are ignored.

## Common setups

### Local preview

Create `.env` in the theme repo root:

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

Then run:

```bash
pnpm content:sync
pnpm dev
```

To preview while writing, run `pnpm content:watch` in a second terminal. See [Local Preview and Debugging](/en/guide/content-separation/local-preview/) for the full steps.

### GitHub Actions

The theme repo's official `deploy.yml.example` checks the content repo out to `.content-src/`, then points `CONTENT_DIR` at it:

```yaml
env:
  CONTENT_DIR: .content-src
```

The checkout step uses `CONTENT_REPO_TOKEN`:

```yaml
- uses: actions/checkout@v4
  with:
    repository: OWNER/shirone-content
    ref: ${{ github.event.client_payload.sha || 'main' }}
    path: .content-src
    token: ${{ secrets.CONTENT_REPO_TOKEN }}
    persist-credentials: false
```

This setup does not need `CONTENT_REPO_URL`. `CONTENT_REPO_TOKEN` is only for checkout; `content:sync` does not read it.

### Cloudflare Pages / Vercel / EdgeOne / Netlify

Platform builders clone the theme repo themselves and cannot check out a second repository, so they use `CONTENT_REPO_URL`:

```text
CONTENT_REPO_URL=https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

The platform runs `pnpm build`, which includes `content:sync`. Do not prepend `pnpm content:sync &&` to the build command.

## Private repos and tokens

- The token only needs `Contents: Read` on the content repo; it does not need access to the theme repo.
- Use HTTPS when embedding a token. SSH URLs require a private key on the builder, which most hosting platforms do not provide.
- If the token is expired, revoked, or lacks content repo access, the log shows `Authentication failed`.
- Do not commit `.env`, a token-bearing URL, or the token itself.
- Use the platform's environment variables or secrets for platform builds; do not rely on a `.env` file in the repo.

## Troubleshooting

::: collapse
- `CONTENT_REPO_URL` is set, but the build still uses the theme repo's bundled content

  Check whether `CONTENT_DIR` is also set; it has higher precedence. Also confirm the variable is configured where the builder reads it, not only in a local `.env`.

- The content branch changed, but the build still has old content

  Check whether `CONTENT_REPO_REF` is pinned to an old branch or SHA. Platform build caches can also keep an old `.content-src/`. Clear the cache and rebuild if needed.

- `CONTENT_SYNC_PULL=false` fails

  This setting requires `.content-src/` to match the current URL, ref, and commit, and requires a clean working copy. Run a normal sync first, or delete `.content-src/` and rebuild.

- The URL contains special characters

  Token-bearing URLs need URL encoding. Prefer the `x-access-token:<TOKEN>` form and avoid special characters in usernames or passwords.

- Does a public content repo need a token

  No. Use `https://github.com/OWNER/REPO.git` directly. Only private repos need a token-bearing URL.
:::

## Related pages

- [Local Preview and Debugging](/en/guide/content-separation/local-preview/)
- [Cross-Repo CI Automation](/en/guide/content-separation/ci-dispatch/)
- [Cloud Deploy Hook Integrations](/en/guide/content-separation/deploy-hooks/)
- [CLI Workflows](/en/guide/content-separation/cli-workflows/)
