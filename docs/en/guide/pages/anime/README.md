---
title: Anime Page
createTime: 2026/09/01 00:24:00
permalink: /en/guide/pages/anime/
---

The anime page (`/anime/`) shows your watchlist with three data sources: local handwritten data (default), Bangumi snapshots, and Bilibili snapshots. The core design is a **dual-plane model**—external sync happens only in the explicit `pnpm anime:sync` stage; page runtime and default builds never call external APIs directly.

## Data Source Model

```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,          // controls page rendering only; no external connections
  source: {
    kind: "local",       // "local" | "snapshot"
    // provider: "bangumi",
    // file: "bangumi.json",
    // fetchOnDev: true,
  },
  fallback: {
    kind: "local",       // fall back to local data if a snapshot is lost or invalid
  },
  providers: {
    bangumi: { enable: false, userId: "" },
    bilibili: { enable: false, vmid: "" },
  },
})
```

| Mode | Source | Traits |
| --- | --- | --- |
| `local` | `src/data/anime.ts` | Default. Fully offline, zero network, zero build-script burden |
| `snapshot` | Sanitized JSON under `src/data/anime-snapshots/` | Fetched and cleaned at sync time; sync happens only via the explicit command |

## Scenario A: Local Data (Default)

Edit `src/data/anime.ts` directly—most stable and secure, zero external dependencies. Ideal if you don't want to link external accounts.

## Scenario B: Bangumi Snapshot

::: steps

1. Fill in your Bangumi numeric UID or public username and enable the provider:

   ```ts title="src/config/animeConfig.ts"
   providers: {
     bangumi: {
       enable: true,
       userId: "sai",   // your Bangumi UID
       request: { pageSize: 50, maxItems: 300, minDelayMs: 200 },
     },
   }
   ```

2. Switch `source` to snapshot mode:

   ```ts
   source: { kind: "snapshot", provider: "bangumi" },
   ```

3. Run the sync command to generate the snapshot:

   ```bash
   pnpm anime:sync --provider bangumi
   ```

4. Rebuild—the anime page now shows Bangumi data.

:::

## Scenario C: Bilibili Snapshot

::: steps

1. Fill in your public Bilibili UID and enable:

   ```ts title="src/config/animeConfig.ts"
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

2. **If your watchlist is private**, configure the credential in `.env` (credentials only enter the sync process—never client code or Git):

   ```text title=".env"
   BILI_SESSDATA="your_sessdata"
   ```

3. Switch the data source and sync:

   ```bash
   # source: { kind: "snapshot", provider: "bilibili" }
   pnpm anime:sync --provider bilibili
   ```

:::

## Cover Caching

```ts
cover: {
  mode: "local",   // "local" download into the site (recommended) | "remote" remote links | "none"
  useWebp: true,
},
```

`local` mode downloads covers into the site (bundled with the build), avoiding dead links and hotlinking; `useWebp` converts them to smaller WebP.

## Fallback Strategy

```ts
fallback: { kind: "local" },
```

If a snapshot file is lost or fails to parse, the page automatically falls back to local data in `src/data/anime.ts`—the anime page never goes blank.

## Zero-Overhead Boundaries

- `enable: false` only controls page rendering; the theme itself never opens external connections
- Without an explicit `pnpm anime:sync`, default builds never request external APIs
- Private credentials (SESSDATA) are injected only into the sync process via environment variables—never into client code or Git commits

## FAQ

::: collapse
- Snapshot sync failed
  Check network reachability, account ID correctness, and whether SESSDATA is configured and unexpired for private lists. Sync commands have rate-limit parameters (`minDelayMs`)—increase them if throttled.

- The page didn't change after switching sources
  Confirm `source.kind` is switched, the snapshot file exists (`src/data/anime-snapshots/`), and the sync command completed successfully.

- Can I hand-edit synced data
  Yes. Snapshots are plain JSON and fine for small tweaks; but the next `anime:sync` regenerates and overwrites them—for lasting changes, use local mode or fold edits into your publish workflow after each sync.

- Will credentials end up in the build output
  No. `BILI_SESSDATA` is read only while the sync command runs; after the snapshot is generated, credentials play no part in the build output.
:::
