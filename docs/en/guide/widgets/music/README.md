---
title: Music Player
createTime: 2026/09/01 00:42:00
permalink: /en/guide/widgets/music/
---

The sidebar music player is Shirone's most complex optional widget, configured in `musicConfig.ts` with four data-source modes. Mounted in the persistent sidebar, Swup in-site navigation **never interrupts playback**.

## Triple Enable Condition

The music feature loads and renders only when **all three** conditions hold (otherwise zero DOM, zero requests):

1. `musicConfig.enable` is `true` (global switch)
2. The data source contains at least one valid track (or a valid Meting playlist ID)
3. A `type: "music"` entry exists in `sidebarConfig.components` with `enable: true`

## Config Overview

```ts title="src/config/musicConfig.ts"
export const musicConfig = withUserConfig("music", {
  enable: true,
  provider: "mixed",        // "local" | "custom" | "meting" | "mixed"
  meting: {
    server: "netease",      // Meting server (NetEase etc.)
    type: "playlist",
    id: "14164869977",      // playlist ID
  },
  defaultVolume: 0.7,       // initial volume
  defaultMode: "sequence",  // initial playback mode
})
```

## Four Data-Source Modes

### 1. local — Local Mode (Default)

```ts
provider: "local"
```

Data from `src/data/music.ts`. Zero external API dependencies, millisecond-ready first screen, statically bundled, **plays even offline**.

### 2. custom — Custom Track List

```ts
provider: "custom",
tracks: [
  {
    id: "song-1",
    title: "Song",
    artist: "Artist",
    cover: "https://…/cover.jpg",   // cover (remote OK)
    source: "https://…/audio.mp3",  // audio URL (remote OK)
    duration: 240,                  // seconds (optional)
  },
],
```

Pass track arrays directly in the config—no need to touch the shared data file. Great for temporarily hosting a few external tracks.

### 3. meting — Cloud Playlist

```ts
provider: "meting",
meting: { server: "netease", type: "playlist", id: "14164869977" },
```

Pulls from the Meting API (NetEase, QQ Music, KuGou, etc.) on the client, on demand—huge libraries with automatic cover parsing. **Depends on external API availability**.

### 4. mixed — Hybrid Mode (Recommended)

```ts
provider: "mixed",
meting: { server: "netease", type: "playlist", id: "14164869977" },
```

Local tracks play immediately on first screen while the Meting playlist loads in the background and seamlessly extends the list; on network failure or API issues it **silently degrades** to local tracks—never broken.

## Initial Playback State

```ts
defaultVolume: 0.7,       // 0 ~ 1
defaultMode: "sequence",  // initial playback mode
```

These two fields only define the **first initialization**. Once mounted, the persistent sidebar runtime owns the current track, position, volume, and mode—Swup navigation never re-reads the defaults or rebuilds the player.

## Mounting in the Sidebar

```ts title="src/config/sidebarConfig.ts"
{ type: "music", enable: true, slot: "top" }
```

`slot: "top"` pins it to the sidebar top. The player card includes album art, track info, a progress bar, and play/previous/next/volume controls.

## Practical Examples

**Ready-to-go hybrid mode**

```ts title="src/config/musicConfig.ts"
{
  enable: true,
  provider: "mixed",
  meting: { server: "netease", type: "playlist", id: "YOUR_PLAYLIST_ID" },
  defaultVolume: 0.5,
  defaultMode: "sequence",
}
```

**Pure offline local playlist**

```ts title="src/data/music.ts"
// maintain the track list (id/title/artist/cover/source/duration)
```

```ts title="src/config/musicConfig.ts"
{
  enable: true,
  provider: "local",
  defaultVolume: 0.6,
  defaultMode: "sequence",
}
```

## FAQ

::: collapse
- The player doesn't appear
  Check the triple condition layer by layer: `musicConfig.enable` → valid tracks/playlist ID in the source → `enable: true` on the music entry in `sidebarConfig`. Any miss means zero DOM (by design).

- The Meting playlist fails to load
  Meting relies on third-party API services; `mixed` mode degrades to local tracks automatically on failure, while pure `meting` mode may briefly have no playlist. A populated local source is the most reliable fallback.

- Does music restart on navigation
  No. The player mounts in the persistent sidebar outside the Swup container—playback continues seamlessly and state is preserved.

- Does volume reset on refresh
  `defaultVolume` only applies at first initialization; a visitor's adjusted volume is held by the player runtime (persisted within the session).
:::
