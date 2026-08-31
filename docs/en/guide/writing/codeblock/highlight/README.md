---
title: Syntax Highlighting
createTime: 2026/08/31 23:20:00
permalink: /en/guide/writing/codeblock/highlight/
---

Shirone integrates the Expressive Code engine to deliver syntax highlighting powered by Shiki with full theme adaptation and line numbering.

## Basic Syntax Highlighting

Declare the language identifier directly after the opening code fence:

````markdown
```typescript
interface UserProfile {
  name: string;
  avatar: string;
  themeColor: number;
}
```
````

## Line Numbers (showLineNumbers)

Add `showLineNumbers` to the code fence attributes to display line numbering:

````markdown
```rust showLineNumbers
fn main() {
    println!("Hello, Shirone!");
}
```
````

## Features

- **Pre-rendered SSR**: All highlights and line tokens compile statically at build time without client layout shifts.
- **Theme Adaptive**: Foreground and background colors dynamically match the active Material 3 Expressive palette.
