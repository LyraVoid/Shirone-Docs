---
title: 音频朗读条
createTime: 2026/08/31 23:34:00
permalink: /guide/writing/media/audio/
---

音频朗读条（Audio Reader）允许在正文中为特定词句或短语插入行内发音、有声朗读或音频试听按钮。

## 语法格式

使用 `:audio-reader` 文本指令并传入音频文件地址 `src`：

```markdown
日语中「ありがとう」的读音为 :audio-reader[发音示范]{src="/assets/audio/arigatou.mp3"}。
```

## 交互效果

- 正文中呈现为精巧的发音波形微徽章。
- 点击后播放对应音频片段，并带有声波跳动视觉反馈。
- 采用原生 Web Audio API 与 HTML5 Audio，轻量流畅。
