---
title: Anime Page
createTime: 2026/09/01 00:24:00
permalink: /en/guide/pages/anime/
---

The anime page (`/anime/`) displays your personal anime watchlist using one of three approaches: local handwritten data (default), synced Bangumi watchlist, or synced Bilibili watchlist. **Data synchronization is fully separated from page presentation**: external data is downloaded only when you explicitly run `pnpm anime:sync`; visitor browsing and standard site builds never call external APIs.

::: tip Content Separation Mode (Dual-Repo Setup) Notice
If you use Shirone's recommended dual-repo setup (theme code repository + standalone content repository), your anime configuration lives in `config/anime.yaml` within your **content repository** (and handwritten data in `data/anime.ts`).

After updating the configuration, **you must run `pnpm anime:sync --if-stale && pnpm build` to fetch your watchlist and rebuild the site**, before your personal entries appear. See [Content Separation & Anime Sync Workflow](#content-separation--anime-sync-workflow) below for details.
:::

## Data Source Modes

::: tabs
@tab Single-Repo Mode (TS)
```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,          // Controls whether the page is active; no external connections
  source: {
    kind: "local",       // "local" handwritten data | "snapshot" synced data
    // provider: "bangumi",
    // file: "bangumi.json",
    // fetchOnDev: true,
  },
  fallback: {
    kind: "local",       // Fall back to local data if synced data is missing or invalid
  },
  providers: {
    bangumi: { enable: false, userId: "" },
    bilibili: { enable: false, vmid: "" },
  },
})
```
@tab Content Separation Mode (YAML)
```yaml title="config/anime.yaml"
# Page master toggle
enable: true

# Data source: local (reads data/anime.ts) or snapshot (reads synced data)
source:
  kind: "local"
  # provider: "bangumi"
  # file: "bangumi.json"
  # fetchOnDev: true

# Fallback strategy (when local cache is missing or fetch fails)
fallback:
  kind: "local"

# External platform accounts
providers:
  bangumi:
    enable: false
    userId: ""
  bilibili:
    enable: false
    vmid: ""
    sessdataEnv: "BILI_SESSDATA"
```
:::

| Mode | Source | Description |
| --- | --- | --- |
| `local` | `src/data/anime.ts` (or `data/anime.ts` in dual-repo) | Default approach. Fully offline handwritten data with zero network requirements |
| `snapshot` | Local JSON files in `src/data/anime-snapshots/` | Watchlist data pre-downloaded via CLI commands, read directly during build |

---

## Method A: Local Handwritten Data (Default)

Edit `src/data/anime.ts` directly (or `data/anime.ts` in your content repository). Ideal if you prefer not to connect third-party platform accounts.

---

## Method B: Sync Bangumi Watchlist

::: steps

1. In your configuration, enter your Bangumi numeric UID or username and set `enable` to `true`:

   ::: tabs
   @tab Content Separation (config/anime.yaml)
   ```yaml title="config/anime.yaml"
   source:
     kind: "snapshot"
     provider: "bangumi"

   providers:
     bangumi:
       enable: true
       userId: "sai"   # Your Bangumi numeric UID or public username
       cover:
         mode: "remote"  # Covers: remote direct link (default) | local download | none
       request:
         pageSize: 50
         maxItems: 300
         minDelayMs: 200
   ```
   @tab Single-Repo (animeConfig.ts)
   ```ts title="src/config/animeConfig.ts"
   source: { kind: "snapshot", provider: "bangumi" },
   providers: {
     bangumi: {
       enable: true,
       userId: "sai",   // your Bangumi UID
       cover: { mode: "remote" },
       request: { pageSize: 50, maxItems: 300, minDelayMs: 200 },
     },
   }
   ```
   :::

2. Run the sync and build commands:

   ```bash
   pnpm anime:sync --provider bangumi
   pnpm build
   ```

3. Once built, the anime page will display your Bangumi watchlist.

:::

---

## Method C: Sync Bilibili Watchlist

::: steps

1. Enter your public Bilibili UID and enable the provider:

   ::: tabs
   @tab Content Separation (config/anime.yaml)
   ```yaml title="config/anime.yaml"
   source:
     kind: "snapshot"
     provider: "bilibili"

   providers:
     bilibili:
       enable: true
       vmid: "12345678"     # Your Bilibili numeric UID
       sessdataEnv: "BILI_SESSDATA"
       cover:
         mode: "local"
         useWebp: true
       request:
         pageSize: 30
         maxItems: 300
         minDelayMs: 300
   ```
   @tab Single-Repo (animeConfig.ts)
   ```ts title="src/config/animeConfig.ts"
   source: { kind: "snapshot", provider: "bilibili" },
   providers: {
     bilibili: {
       enable: true,
       vmid: "12345678",     // your Bilibili UID
       sessdataEnv: "BILI_SESSDATA",
       cover: { mode: "local", useWebp: true },
       request: { pageSize: 30, maxItems: 300, minDelayMs: 300 },
     },
   }
   ```
   :::

2. **If your watchlist is set to private**, add your login credential to `.env` (locally) or platform environment variables (cloud):

   ```text title=".env"
   BILI_SESSDATA="your_sessdata"
   ```

   > [!IMPORTANT] Credential Security
   > Your login credential is used only during sync command execution. It is never included in frontend client bundles and must never be committed to Git.

3. Run sync and build:

   ```bash
   pnpm anime:sync --provider bilibili
   pnpm build
   ```

:::

---

## Content Separation & Anime Sync Workflow

In a dual-repo (content separation) setup, users often ask: **"Why does my site still show default sample anime after updating `config/anime.yaml` in the content repository?"**

Displaying your external watchlist requires two actions:
1. **Sync Configuration**: Bring `config/anime.yaml` from your content repo into the theme code repo;
2. **Download Data**: Run the CLI sync command to fetch your watchlist from Bilibili or Bangumi to local storage (plus any covers configured as `local`).

Simply saving a YAML file does not trigger network requests. You must execute the sync command to download data locally before building the site.

### Recommended Command: Fetch & Build in One Go

```bash
# Check if cache is expired, download data if needed, and build the site
pnpm anime:sync --if-stale && pnpm build
```

How this pipeline executes:
1. `pnpm anime:sync --if-stale`:
   - Checks whether local cached files exist;
   - **`--if-stale` cache check**: If local data is still fresh (default: 30 days, configurable via `snapshot.staleAfterDays`), it **skips network requests** and exits cleanly (exit 0) to avoid third-party rate limits. If data is expired or missing, it downloads your latest watchlist (and covers configured with `cover.mode: "local"`);
   - If no provider is configured, the command skips safely without interrupting the build.
2. `&& pnpm build`:
   - Copies the latest articles and configuration files from your content repo;
   - Compiles static pages, generates search indexes, and builds the production site.

### CLI Sync Commands Quick Reference

| Command | Description | Use Case |
| :--- | :--- | :--- |
| `pnpm anime:sync --if-stale && pnpm build` | **Recommended**. Fetch expired data and build the site | GitHub Actions CI/CD, one-command publishing |
| `pnpm anime:sync` | Force download watchlist data for all enabled providers | Initial setup, manual forced refresh |
| `pnpm anime:sync --if-stale` | Download data only if cache has expired (> 30 days) | Local pre-check before preview |
| `pnpm anime:sync --provider bangumi` | Force sync Bangumi data only (covers follow `cover.mode`) | Debugging Bangumi sync |
| `pnpm anime:sync --provider bilibili` | Force sync Bilibili data (cover download included by default) | Debugging Bilibili sync & covers |
| `pnpm anime:sync --provider all` | Force sync all supported providers | Comprehensive multi-platform check |

---

## Cover Strategy (Local Caching & Anti-Hotlinking)

Covers for both providers are configured via `cover.mode`: `local` (download to your site), `remote` (use external links directly), or `none` (no covers). **The defaults differ**:

| Provider | Default | Reason |
| :--- | :--- | :--- |
| Bilibili | `local` | Hotlink protection on hdslb.com is bypassed by Shirone's built-in `no-referrer` (`remote` works too), but local caching adds WebP compression and zero third-party dependence — more robust |
| Bangumi | `remote` | The bgm.tv image host has no hotlink protection, so direct links display fine; switch to `local` when needed |

```yaml title="config/anime.yaml"
providers:
  bilibili:
    cover:
      mode: "local"   # "local" download into local assets (recommended) | "remote" | "none"
      useWebp: true   # Bilibili's CDN supports server-side WebP compression
  bangumi:
    cover:
      mode: "remote"  # "remote" direct link (default) | "local" download into local assets | "none"
      # mirror: "https://your-proxy.example.com"  # optional mirror prefix (remote mode)
```

With `local` mode enabled, the sync script downloads cover images to `public/assets/anime/covers/` (file names prefixed with `bili_{ID}` and `bgm_{subjectId}` respectively), bundling them with your static assets. Covers no longer depend on third-party image hosts' hotlink policies or uptime; Bilibili covers are also converted to smaller WebP files (the Bangumi image host does not support server-side conversion, so files are saved in their original format). Failed downloads fall back to the remote URL, so covers never go missing.

With `remote` mode, the snapshot only stores image URLs and visitor browsers load them in real time (Shirone's cover `<img>` tags carry `no-referrer`, which bypasses Bilibili's hotlink protection). Cover visibility then depends on the image host being reachable — use `local` if you want zero third-party dependence.

---

## Fallback Strategy

```yaml title="config/anime.yaml"
fallback:
  kind: "local"       # "local" fall back to local data | "empty" show empty state
```

If cached data is missing or fetching fails, the page safely falls back to `data/anime.ts`, preventing blank screens or build errors.

---

## Troubleshooting

::: collapse
- Why didn't the page update after modifying `anime.yaml`?

  Saving the YAML file does not automatically trigger network downloads. In your theme code repository, run `pnpm anime:sync --if-stale && pnpm build` (or `pnpm anime:sync` followed by `pnpm dev` for local preview) to download your watchlist locally.

- Why should I use `--if-stale`?

  Platforms enforce strict rate limits against frequent API scraping. `--if-stale` checks whether your cached data has passed the expiry limit (default 30 days). Fresh caches are skipped, keeping your account safe and your CI builds fast.

- What to check if data sync fails?

  1. Check network connectivity;
  2. Verify your account ID (Bilibili requires a numeric UID; Bangumi supports numeric UID or username);
  3. Ensure `BILI_SESSDATA` is set for private Bilibili watchlists;
  4. If throttled by the platform, increase `request.minDelayMs` in configuration (e.g. 500 or 1000 ms).

- Can I edit downloaded JSON files manually?

  Yes. Cached files are stored at `src/data/anime-snapshots/<provider>.json` as standard formatted JSON. However, running `pnpm anime:sync` without `--if-stale` will overwrite your changes. If you want permanent manual control, set `source.kind: "local"` and edit `data/anime.ts`.
:::
