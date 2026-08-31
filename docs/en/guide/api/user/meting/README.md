---
title: Meting API
createTime: 2026/09/01 01:00:00
permalink: /en/guide/api/user/meting/
---

The Meting API is a universal music metadata aggregator. Shirone's sidebar music player uses it to resolve playlists, albums, and single tracks from mainstream streaming platforms like NetEase Cloud Music and Tencent QQ Music on demand.

In Shirone, Meting API interactions are handled by `src/utils/music/meting.ts` and work seamlessly in both pure cloud mode (`meting`) and hybrid mode (`mixed`).

## Configuration <Badge text="src/config/musicConfig.ts" type="info" vertical="middle" />

Configure the Meting source in `src/config/musicConfig.ts`:

```ts title="src/config/musicConfig.ts"
export const musicConfig = withUserConfig("music", {
  enable: true,
  provider: "mixed", // "local" | "meting" | "custom" | "mixed"
  meting: {
    server: "netease", // music server
    type: "playlist",  // resource type
    id: "14164869977", // resource ID
    // api: "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r", // optional custom API
  },
  defaultVolume: 0.7,
  defaultMode: "sequence",
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `server` | `MetingServer` | `"netease"` | Music service provider: `netease`, `tencent`, `kugou`, `xiami`, `baidu` |
| `type` | `MetingType` | `"playlist"` | Resource type: `playlist`, `song`, `album`, `artist` |
| `id` | `string` | `""` | Target resource ID on the provider platform |
| `api` | `string` | *(default public API)* | Custom Meting API template URL (defaults to public endpoint) |

## API Template & Parameters

Meting queries are dynamically constructed using a URL template:

```text
{api_base_url}?server=:server&type=:type&id=:id&auth=:auth&r=:r
```

- `:server`: Platform key (e.g. `netease`, `tencent`)
- `:type`: Resource type (e.g. `playlist`, `song`)
- `:id`: Resource unique identifier
- `:auth`: Authentication parameter (usually empty for public servers)
- `:r`: Cache-busting timestamp

### Default Public API

Shirone's built-in default endpoint is:

```text
https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r
```

::: tip Self-Hosting Recommended
Public community APIs may experience intermittent downtime, rate limits, or region blocking. For maximum reliability, self-hosting a Meting API instance is recommended.
:::

## Response Structure

On success, the Meting API returns a JSON array of track objects:

```json
[
  {
    "id": 1827600686,
    "name": "Track Title",
    "artist": "Artist Name",
    "url": "https://.../audio.mp3",
    "pic": "https://.../cover.jpg",
    "lrc": "https://.../lyric.lrc",
    "duration": 248000
  }
]
```

### Data Sanitization & Normalization

Shirone performs normalization on client-side received songs (`parseMetingSong`):

1. **Unique ID prefixing**: Formatted as `meting-${server}-${id}` to prevent collision with local tracks.
2. **Duration conversion**: If `duration` is in milliseconds (> 10000), it is converted to seconds (`Math.floor(duration / 1000)`).
3. **Deduplication**: Filters out duplicate tracks with identical IDs.
4. **Immutability**: Frozen as read-only `TrackDescriptor` objects.

## Operating Modes & Fallback

### Hybrid Mode (`mixed`, Recommended)

- **Instant readiness**: Loads local tracks from `src/data/music.ts` first, ensuring immediate audio playback upon initial page load.
- **Async expansion**: Fetches the Meting playlist asynchronously in the background and merges items when resolved.
- **Silent fallback**: If network issues or API errors occur, the player seamlessly keeps the local playlist without crashing.

### Pure Cloud Mode (`meting`)

- Exclusively uses tracks fetched from the Meting API.
- Ideal when you do not want to maintain audio files in the source repository.

## Self-Hosting Meting API

Deploying your own instance is straightforward with open-source implementations like [Meting-API](https://github.com/injahow/meting-api):

::: tabs
@tab Vercel One-Click
1. Fork [injahow/meting-api](https://github.com/injahow/meting-api).
2. Import and deploy on Vercel to obtain your custom domain `https://your-meting.vercel.app`.
3. Set your custom endpoint in `musicConfig.ts`:
   ```ts
   meting: {
     api: "https://your-meting.vercel.app/api?server=:server&type=:type&id=:id&r=:r",
   }
   ```

@tab Docker
```bash
docker run -d --name meting-api -p 3000:3000 injahow/meting-api
```
Configure your reverse proxy URL accordingly.
:::

## FAQ

::: collapse
- Why do some tracks fail to play?

  Copyright restrictions (VIP tracks, lossless exclusivity, geo-blocks) may prevent third-party APIs from obtaining playable direct URLs. Choose public playlists with non-VIP tracks or host crucial songs locally.

- How to find a NetEase playlist ID?

  Open the playlist on the NetEase web player. The URL is `https://music.163.com/#/playlist?id=14164869977`, where the numeric portion is your `id`.

- CORS errors when requesting the API

  Ensure your self-hosted server returns `Access-Control-Allow-Origin: *`. The built-in default endpoint has CORS enabled by default.
:::
