---
title: Data Snapshots & Offline Sync
createTime: 2026/09/01 03:40:00
permalink: /en/guide/api/user/data-sync/
---

External anime data follows a dual-plane model: requests happen during explicit synchronization, while pages read local JSON snapshots. Runtime pages do not call Bangumi or Bilibili directly.

## Sync Commands

```bash
pnpm anime:sync --provider bangumi
pnpm anime:sync --provider bilibili
```

The entry point is `scripts/anime/sync.mjs`; providers live in `scripts/anime/providers/`. Credentials are read only during synchronization and must not be stored in posts or committed.

## Snapshot Lifecycle

1. The script reads `animeConfig` and environment variables.
2. A provider calls its API, sanitizes the response, and writes a local snapshot.
3. `src/pages/anime.astro` and page components consume the snapshot during build.
4. Commit snapshots intended for publishing; deployment needs no external API request.

When a sync fails, keep the last valid snapshot. Check credentials, user IDs, network access, and rate limits before retrying.
