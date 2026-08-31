---
title: Audio Reader
createTime: 2026/08/31 23:34:00
permalink: /en/guide/writing/media/audio/
---

The Audio Reader directive inserts inline pronunciation and audio preview playback buttons within Markdown paragraphs.

## Syntax

Use the `:audio-reader` text directive with an audio `src`:

```markdown
Pronunciation of the word is :audio-reader[Listen]{src="/assets/audio/sample.mp3"}.
```

## Behavior

- Renders an inline waveform badge inside the paragraph.
- Plays the audio sample with visual feedback on click.
- Built using lightweight HTML5 Audio APIs.
