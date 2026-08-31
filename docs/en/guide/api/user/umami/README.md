---
title: Umami API
createTime: 2026/09/01 01:15:00
permalink: /en/guide/api/user/umami/
---

[Umami](https://umami.is/) is an open-source, self-hosted, privacy-respecting website analytics service. In Shirone, Umami analytics is powered by [`oddmisc`](https://www.npmjs.com/package/oddmisc), enabling client-side data access via public share URLs alongside optional official tracking script integration.

## Architecture Layers

Shirone's Umami integration separates capabilities into two clean layers:

1. **Public Share Stats Layer (Public Share API)**: Securely reads site-wide and per-page PV/UV metrics on the frontend via a public share link (`shareUrl`), without requiring admin tokens or sensitive credentials.
2. **Visitor Tracking Layer**: Injects the lightweight official tracking script (`scriptUrl` + `websiteId`) to record visitor analytics.

## Configuration <Badge text="src/config/siteConfig.ts" type="info" vertical="middle" />

Configure Umami in `src/config/umamiConfig.ts` (or `config/umami.yaml` in dual-repo setup):

```ts title="src/config/umamiConfig.ts"
export const umamiConfig = withUserConfig("umami", {
  enable: true,
  shareUrl: "https://umami.example.com/share/xxxxxx",
  // Optional: configure both fields to track visits
  websiteId: "your-website-id",
  scriptUrl: "https://umami.example.com/script.js",
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | Global toggle. When `false`, zero requests, DOM nodes, or scripts are loaded |
| `shareUrl` | `string` | `""` | Umami public share link (required; missing disables all stats) |
| `websiteId` | `string` | `""` | Website ID (optional; active only when paired with `scriptUrl`) |
| `scriptUrl` | `string` | `""` | Official tracking script URL (optional; active only with `websiteId`) |

### Resolution Rules

- `enable: false` → Entirely inactive (zero footprint)
- Only `shareUrl` supplied → Display public stats only (read-only mode)
- `shareUrl` + `websiteId` + `scriptUrl` supplied → Public stats + visitor tracking both enabled

## Supported Share URL Formats

Both self-hosted instances and official cloud formats are supported out of the box:

- Self-hosted: `https://umami.yourdomain.com/share/<shareId>`
- Official Cloud: `https://cloud.umami.is/analytics/us/share/<shareId>`
- Custom paths: `https://umami.yourdomain.com/analytics/share/<shareId>`

---

## Client JavaScript API

When Umami is enabled, the browser global object `window.oddmisc` exposes the following asynchronous methods:

### 1. Site-Wide Stats

```js
const siteStats = await window.oddmisc.getSiteStats();
console.log(siteStats);
```

### 2. Specific Page Stats

```js
const pageStats = await window.oddmisc.getPageStats("/posts/hello-world/");
console.log(pageStats);
```

### 3. Active Real-Time Visitors

```js
const active = await window.oddmisc.getActiveVisitors();
console.log(`Live active visitors: ${active.x}`);
```

### 4. Client Ready Event

```js
window.addEventListener("oddmisc-ready", (event) => {
  const client = event.detail.client;
  client.getSiteStats().then((stats) => {
    console.log("Umami stats loaded:", stats);
  });
});
```

---

## Response Data Structure

```ts
interface StatsResult {
  /** Total page views */
  pageviews: number;
  /** Unique visitors */
  visitors: number;
  /** Total session visits */
  visits: number;
  /** Bounce count (optional) */
  bounces?: number;
  /** Average visit duration in seconds (optional) */
  totaltime?: number;
  /** Comparison metrics against previous period (optional) */
  comparison?: {
    pageviews?: number;
    visitors?: number;
    visits?: number;
  };
  /** Indicates whether the result was served from cache */
  _fromCache?: boolean;
}
```

---

## Caching & Request Coalescing

To prevent unnecessary API pressure during frequent navigation, Shirone incorporates several performance safeguards:

1. **Dual-Tier Cache**: Memory and `localStorage` caching with a 1-hour TTL.
2. **In-Flight Coalescing**: Concurrent requests for the same page route reuse the same pending Promise (`__shironeUmamiStatsPromises`).
3. **Swup SPA Integration**: Listens for `swup:content:replace` and `swup:page:view` events to update stats during seamless page transitions.

---

## Error Classification

When a request encounters an issue, standard error instances are thrown:

- `UmamiUrlError` (`INVALID_URL`): Invalid share link URL format.
- `UmamiAuthError` (`AUTH_FAILED`): HTTP 401, indicating the share ID is expired or revoked.
- `UmamiNetworkError` (`NETWORK_ERROR`): Network unreachable or server 5xx response.
- `UmamiTimeoutError` (`TIMEOUT`): Request exceeded timeout (default 10s).

## FAQ

::: collapse
- Where do I get the Share URL?
  In your Umami instance dashboard:
  1. Go to **Settings** → **Websites**.
  2. Click **Edit** on your website entry.
  3. Open the **Share URL** tab, toggle on sharing, and copy the link.

- Stats component shows `--` with no data
  1. Verify that the `shareUrl` opens properly in a browser and displays stats charts.
  2. Check browser dev tools for CORS errors.
  3. If the share link was just created, wait for your first visitor hit to be recorded.
:::
