---
title: Inline Spoiler
createTime: 2026/08/31 23:06:00
permalink: /en/guide/writing/markdown/spoiler/
---

Inline spoiler blocks conceal plot twists, answers, or sensitive content until the reader hovers or taps on the hidden area.

## Syntax

Wrap hidden text with the `:spoiler` text directive:

```markdown
The true climax of the story is :spoiler[they had known each other from childhood].

The secret passcode to unlock the room is :spoiler[42-7890].
```

## Behavior

- Displays an opaque tinted mask concealing the underlying text by default.
- Softly reveals the text when hovered with a cursor or tapped on mobile screens.
- Implemented with lightweight CSS interactions ensuring responsive touch support.
