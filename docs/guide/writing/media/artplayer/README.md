---
title: ArtPlayer 播放器
createTime: 2026/08/31 23:33:00
permalink: /guide/writing/media/artplayer/
---

ArtPlayer 播放器组件用于播放自托管的本地视频文件或第三方直链媒体资源（支持 MP4、WebM 与 HLS 流媒体）。

## 语法格式

使用 `::artplayer` 指令并配置参数：

```markdown
::artplayer{src="/videos/demo.mp4" title="本地示例视频" poster="/assets/poster.webp" preload="auto"}
```

## 属性参数列表

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `src` | `string` | 必填 | 无 | 视频直链地址或相对 `/public` 的本地路径 |
| `title` | `string` | 必填 | 无 | 视频标题 |
| `poster` | `string` | 可选 | 无 | 未播放时的封面海报图片路径 |
| `preload` | `string` | 可选 | `"none"` | 预加载策略：`"none"`（默认）或 `"auto"`（视口临近预加载） |

## 核心能力

- **现代播放器体验**：提供精美的播放控制栏、音量调节、倍速播放、全屏与画中画模式。
- **动态按需加载**：只有在文章中使用了 ArtPlayer 时才会异步引入播放器依赖包。
