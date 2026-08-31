---
title: YouTube 视频
createTime: 2026/08/31 23:31:00
permalink: /guide/writing/media/youtube/
---

Shirone 支持嵌入 YouTube 视频，遵循严格的 Facade 占位与预加载控制规范。

## 语法格式

使用 `::youtube` 指令并配置参数：

```markdown
::youtube{id="5gIf0_xpFPI" title="YouTube 演示视频" preload="auto"}
```

## 属性参数列表

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `string` | 必填 | 无 | YouTube 视频链接中的 11 位唯一 ID |
| `title` | `string` | 必填 | 无 | 视频标题描述 |
| `preload` | `string` | 可选 | `"none"` | 预加载策略：`"none"`（默认）或 `"auto"`（视口临近预热） |

## 预加载与隐私策略

- `preload="none"`：未点击前不下载 YouTube 播放器脚本与第三方 Cookie。
- `preload="auto"`：临近视口时提前加载容器占位，提高点击后的响应速度。
