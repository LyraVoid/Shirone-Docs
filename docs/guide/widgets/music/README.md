---
title: 音乐播放器
createTime: 2026/09/01 00:42:00
permalink: /guide/widgets/music/
---

侧栏音乐播放器是 Shirone 最复杂的可选组件，由 `musicConfig.ts` 统一配置，支持四种数据源模式。它挂在持久侧栏中，Swup 站内导航**不会中断播放**。

## 三重启用条件

音乐功能必须**同时满足**以下三项才加载渲染（缺一即零 DOM、零请求）：

1. `musicConfig.enable` 为 `true`（全局开关）
2. 数据源至少包含一首有效曲目（或合法的 Meting 歌单 ID）
3. `sidebarConfig.components` 中 `type: "music"` 条目存在且 `enable: true`

## 配置速览

```ts title="src/config/musicConfig.ts"
export const musicConfig = withUserConfig("music", {
  enable: true,
  provider: "mixed",        // "local" | "custom" | "meting" | "mixed"
  meting: {
    server: "netease",      // Meting 服务（网易云等）
    type: "playlist",
    id: "14164869977",      // 歌单 ID
  },
  defaultVolume: 0.7,       // 初始音量
  defaultMode: "sequence",  // 初始播放模式
})
```

## 四种数据源模式

### 1. local 本地独立模式（默认）

```ts
provider: "local"
```

数据源为 `src/data/music.ts`。零外部 API 依赖、首屏毫秒级就绪、静态打包直出、**断网也能正常播放**。

### 2. custom 自定义列表模式

```ts
provider: "custom",
tracks: [
  {
    id: "song-1",
    title: "曲目名",
    artist: "艺术家",
    cover: "https://…/cover.jpg",   // 封面（可外链）
    source: "https://…/audio.mp3",  // 音频地址（可外链）
    duration: 240,                  // 时长秒数（可选）
  },
],
```

直接在配置中传入曲目数组，无需修改通用数据文件，适合临时挂几首外链歌。

### 3. meting 云端歌单模式

```ts
provider: "meting",
meting: { server: "netease", type: "playlist", id: "14164869977" },
```

接入 Meting API（网易云、QQ 音乐、酷狗等），客户端异步按需拉取海量曲库与封面。**依赖外部接口可用性**。

### 4. mixed 混合增强模式（推荐）

```ts
provider: "mixed",
meting: { server: "netease", type: "playlist", id: "14164869977" },
```

首屏立即播放本地曲目，后台无感拉取 Meting 远端歌单并在就绪后无缝扩容；断网或接口故障时**自动静默降级**为本地曲目，绝不报错破版。

## 播放初始状态

```ts
defaultVolume: 0.7,       // 0 ~ 1
defaultMode: "sequence",  // 初始播放模式
```

两个字段只定义**首次初始化**的音量与播放模式。播放器挂载后由持久侧栏运行时持有当前曲目、播放位置、音量与模式——Swup 切页不会重读默认值或重建播放器。

## 挂载到侧栏

```ts title="src/config/sidebarConfig.ts"
{ type: "music", enable: true, slot: "top" }
```

`slot: "top"` 固定在侧栏顶部；播放器卡片包含专辑封面、歌曲信息、进度条、播放/上一首/下一首/音量控制。

## 实战示例

**开箱即用的混合模式**

```ts title="src/config/musicConfig.ts"
{
  enable: true,
  provider: "mixed",
  meting: { server: "netease", type: "playlist", id: "你的歌单ID" },
  defaultVolume: 0.5,
  defaultMode: "sequence",
}
```

**纯本地离线歌单**

```ts title="src/data/music.ts"
// 维护曲目清单（id/title/artist/cover/source/duration）
```

```ts title="src/config/musicConfig.ts"
{
  enable: true,
  provider: "local",
  defaultVolume: 0.6,
  defaultMode: "sequence",
}
```

## 常见问题

::: collapse
- 播放器不出现
  按三重条件逐层检查：`musicConfig.enable` → 数据源是否有有效曲目/歌单 ID → `sidebarConfig` 中 music 条目 `enable: true`。任一不满足即零 DOM（设计行为）。

- Meting 歌单拉取失败
  Meting 依赖第三方 API 服务，接口波动时 `mixed` 模式会自动降级为本地曲目；`meting` 纯云端模式则会暂时无歌单。配置一个有曲目的本地数据源是最稳的兜底。

- 切页后音乐会重头播吗
  不会。播放器挂在 Swup 容器外的持久侧栏中，站内导航全程连续播放，进度与状态保持。

- 音量每次刷新都回到默认吗
  `defaultVolume` 只作用于首次初始化；访客调整后的音量由播放器运行时持有（会话内保持）。
:::
