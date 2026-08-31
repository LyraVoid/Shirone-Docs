---
title: Umami Analytics
createTime: 2026/09/01 00:52:00
permalink: /en/guide/features/umami/
---

Integrate [Umami](https://umami.is/) (open-source, self-hosted analytics) for site traffic stats. Configured via `umamiConfig.ts`, disabled globally by default. Shirone's integration has two capability layers:

1. **Public share stats**: widgets read traffic data from Umami's public share endpoint (requires `shareUrl`)
2. **Visitor collection**: loads the official Umami script to collect visitor behavior (requires both `websiteId` and `scriptUrl`)

## Configuration

```ts title="src/config/umamiConfig.ts"
export const umamiConfig = withUserConfig("umami", {
  enable: false,      // global switch
  shareUrl: "",       // Umami share link (required)
  websiteId: "",      // Umami Website ID
  scriptUrl: "",      // collection script URL
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | Global switch; `false` loads no oddmisc runtime or DOM |
| `shareUrl` | `string` | `""` | Share link (required; missing disables everything) |
| `websiteId` | `string` | `""` | Website ID; enables collection only when paired with `scriptUrl` |
| `scriptUrl` | `string` | `""` | Collection script URL; paired with `websiteId` |

## Resolution Rules

- `enable: false` → entirely inactive (zero requests, DOM, bundle size)
- Empty `shareUrl` → entirely inactive
- Only `shareUrl` filled → public share stats display only
- All three filled → share stats + visitor collection both active

## Enabling Steps

::: steps

1. **Deploy Umami** (self-hosted or their cloud), create a website, and get the `websiteId` and script URL.

2. **Enable the share link** in the Umami console—you'll get a URL like `https://umami.example.com/share/xxxx`.

3. **Fill in the config**:

   ```ts title="src/config/umamiConfig.ts"
   {
     enable: true,
     shareUrl: "https://umami.example.com/share/xxxx",
     websiteId: "your-website-id",
     scriptUrl: "https://umami.example.com/script.js",
   }
   ```

4. **Rebuild and deploy**.

:::

## Privacy Notes

Umami is a cookieless, lightweight analytics solution that doesn't track cross-site identity. Still, it's good practice to disclose the use of analytics in your privacy policy.

## Dual-Repo Override

Analytics is a site-level setting, overridable via `config/umami.yaml` in the content repo (domain key `umami`):

```yaml title="config/umami.yaml (content repo)"
enable: true
shareUrl: https://umami.example.com/share/xxxx
```

## FAQ

**The stats area shows no data**

Check that `shareUrl` is filled and correct—it's the only data source for public share stats; when missing, everything silently disables (by design).

**No visitor data at all**

Confirm `websiteId` and `scriptUrl` are filled as a pair and correct; use browser dev tools to verify the script loaded and is sending requests; check whether the Umami dashboard sees your own visits.

**Does it slow the page**

No. Collection and data pulls are async and on-demand; with `enable: false` (the default) nothing loads at all.