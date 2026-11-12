---
title: Bilibili API
createTime: 2026/09/01 01:10:00
permalink: /en/guide/api/user/bilibili/
---

Bilibili is a major video and ACG streaming platform. In Shirone, Bilibili integrations are utilized in two distinct scenarios:

1. **Anime Watchlist Synchronization (Anime Sync Provider)**: Offline synchronization of user anime follow lists into local snapshots (`scripts/anime/providers/bilibili.mjs`).
2. **Video Embed Facade**: Lazy-loaded, privacy-friendly video player embedding for articles (`src/plugins/markdown/remark-bilibili.mjs`, `src/utils/bilibili.ts`).

---

## Watchlist Sync API

Shirone's sync script fetches follow lists via Bilibili's public user space API.

### Configuration <Badge text="src/config/animeConfig.ts" type="info" vertical="middle" />

Configure the Bilibili provider in `src/config/animeConfig.ts`:

```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,
  source: {
    kind: "snapshot",
    provider: "bilibili",
  },
  providers: {
    bilibili: {
      enable: true,
      vmid: "12345678",             // Your numeric Bilibili UID
      sessdataEnv: "BILI_SESSDATA", // Environment variable for private list credentials
      cover: {
        mode: "local",              // Download covers locally (recommended)
        useWebp: true,              // Convert to WebP format
      },
      request: {
        pageSize: 30,               // Items per page (10 ~ 50, default 30)
        maxItems: 300,              // Maximum entries to fetch
        minDelayMs: 300,            // Request delay in ms
      },
    },
  },
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `vmid` | `string` | `""` | Bilibili numeric account UID (required) |
| `sessdataEnv` | `string` | `"BILI_SESSDATA"` | Name of the environment variable holding private credentials |
| `cover.mode` | `"local" \| "remote" \| "none"` | `"local"` | Cover image strategy: `local` (downloaded locally, recommended), `remote` (direct links), or `none` |
| `cover.useWebp` | `boolean` | `true` | Convert covers to lightweight WebP |
| `request.pageSize` | `number` | `30` | Pagination page size |
| `request.minDelayMs` | `number` | `300` | Delay between pagination requests in milliseconds |

### API Endpoint Specification

- **Endpoint**: `GET https://api.bilibili.com/x/space/bangumi/follow/list`
- **Headers**:
  - `User-Agent`: Desktop browser user-agent
  - `Referer`: `https://space.bilibili.com/`
  - `Cookie`: `SESSDATA=${sessdata};` (injected only if private credentials are configured)

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `type` | `number` | Fixed to `1` (Anime) |
| `follow_status` | `number` | Watch status: `1` Planned / `2` Watching / `3` Completed |
| `vmid` | `string` | Target user UID |
| `ps` | `number` | Page size (max 50) |
| `pn` | `number` | Page number (1-based) |

#### Response Format

```json
{
  "code": 0,
  "message": "0",
  "ttl": 1,
  "data": {
    "list": [
      {
        "media_id": 28228367,
        "season_id": 34209,
        "title": "SPY×FAMILY",
        "cover": "http://i0.hdslb.com/bfs/bangumi/image/....jpg",
        "total_count": 25,
        "progress": "Watched Ep 12",
        "rating": {
          "score": 9.7
        },
        "evaluate": "Master spy Twilight must disguise himself...",
        "publish": {
          "pub_time": "2022-04-09 23:00:00"
        },
        "styles": ["Comedy", "Action"]
      }
    ],
    "total": 45
  }
}
```

- `code: 0`: Success
- `code: 53013` / `-401`: Target follow list is private; requires valid `SESSDATA`.

### Cover Anti-Hotlinking & Loading Strategies

Bilibili image servers (`hdslb.com`) check the Referer header: requests carrying a **foreign site's Referer** get a 403, while requests with **no Referer at all** are served normally. Shirone's anime card `<img>` tags ship with `referrerpolicy="no-referrer"` built in, so `remote` mode (direct links) works out of the box — no mirror or proxy required.

The two common modes:

- **`local` (default, recommended)**: the sync script downloads covers to `public/assets/anime/covers/bili_{id}.webp` at sync time.
  - **Fast loading**: compressed to lightweight WebP via Bilibili's CDN `@220w_280h.webp` parameter;
  - **Zero third-party dependence**: covers ship with your site, immune to hotlink-policy changes or network hiccups — snapshots and images stay fully self-contained.
- **`remote`**: the snapshot stores direct links only (auto-upgraded to HTTPS with the `@220w_280h.webp` compression parameter appended); visitor browsers load them live via `no-referrer`. Sync is faster and no image files land in your repo, but cover availability depends on the Bilibili image host being online.

If the Bilibili image host is slow from your visitors' region, `remote` mode also supports the `cover.mirror` prefix — it is **concatenated directly with the full cover URL**, so both path-style proxies (e.g. `https://your-proxy.com/`) and query-style image proxies (e.g. `https://wsrv.nl/?url=`) work.

---

## Video Embed Facade

When embedding Bilibili videos in Markdown articles, Shirone uses a lightweight facade:

```markdown
::bilibili{bvid="BV1GJ411x7h7" part=1}
```

### Player Endpoint

- **Player URL**: `https://player.bilibili.com/player.html?bvid={bvid}&page={part}&as_wide=1&high_quality=1&danmaku=0`
- **On-Demand Activation**: The page initially loads a lightweight static card without third-party iframes or cookies. The video player iframe only initializes when the visitor clicks the play button.

## FAQ

::: collapse
- Sync error `code: 53013` (Permission Denied)

  Your Bilibili privacy settings have set your watchlist to private.
  Solution: Add `BILI_SESSDATA="your_sessdata"` to your `.env` file or CI environment variables.

  > [!CAUTION]
  > **Credential Security Warning**
  > `SESSDATA` grants full access to your Bilibili account. Never commit `.env` containing real credentials to public git repositories or client bundles.

- Running the sync command

  ```bash
  pnpm anime:sync --provider bilibili
  ```
:::
