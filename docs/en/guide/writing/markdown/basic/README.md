---
title: Basic Syntax
createTime: 2026/08/31 23:00:00
permalink: /en/guide/writing/markdown/basic/
---

Markdown is a lightweight markup language designed for plain-text formatting. Shirone provides native support for the full CommonMark and GitHub Flavored Markdown (GFM) specifications.

## 1. Block Elements

### Paragraphs and Line Breaks

- **Paragraphs**: Consecutive lines of text form a paragraph. Separate paragraphs with one or more blank lines.
- **Hard Line Breaks**: Append two or more trailing spaces before pressing Enter, or add a backslash `\` at the end of the line.

```markdown
This is the first line with two trailing spaces  
This is a hard break within the same paragraph.

This is a new paragraph separated by a blank line.
```

### Headings

Use Atx-style hash marks for headings from level 1 to 6:

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

Anchor IDs are generated automatically and extracted into the table of contents.

### Blockquotes

Prefix lines with `>` to create quotes, supporting multi-level nesting and embedded formatting:

```markdown
> Level 1 blockquote.
>
> > Nested level 2 blockquote.
>
> Nested lists are supported:
> 1. First item
> 2. Second item
>
> `Inline code within quotes`
```

### Lists and Tasks

#### Unordered Lists

Use `-`, `*`, or `+` with a space following the marker:

```markdown
- First item
- Second item
  - Nested sub-item
  - Another sub-item
```

#### Ordered Lists

Use numbers followed by a period `1.`:

```markdown
1. First step
2. Second step
3. Third step
```

#### Task Lists

Use square brackets to denote completion status:

```markdown
- [x] Completed task
- [ ] In-progress item
- [ ] Pending review
```

### Code Blocks

Enclose multi-line code inside triple backticks and declare the language:

````markdown
```typescript
interface SiteConfig {
  title: string;
  themeColor: number;
}
```
````

### Horizontal Rules

Place three or more `-`, `*`, or `_` characters on a line alone:

```markdown
Section above

---

Section below
```

---

## 2. Inline Elements

### Emphasis

```markdown
*Italic text*
**Bold text**
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Links

#### Inline Links

```markdown
[Link text](https://shirone.mysqil.com/ "Optional title")
[Relative site link](/en/guide/intro/)
```

#### Reference Links

```markdown
Refer to the [Documentation][docs] and [Source Code][repo].

[docs]: https://shirone.mysqil.com/ "Docs"
[repo]: https://github.com/LyraVoid/Shirone "GitHub"
```

### Images

Prepend an exclamation mark `!` to the link syntax:

```markdown
![Image alt text](./cover.webp "Optional caption")
```

### Autolinks

Wrap web or email addresses in angle brackets:

```markdown
<https://shirone.mysqil.com>
<contact@example.com>
```

---

## 3. Helpers & Escapes

### Escaping Characters

Prefix Markdown characters with a backslash `\` to render them literally:

```markdown
\*Not italic\*
\[Not a link\]
\# Not a heading
```

Escapable characters: `\`, ``` ` ```, `*`, `_`, `{}`, `[]`, `()`, `#`, `+`, `-`, `.`, `!`.

### Inline HTML

Standard HTML tags can be placed directly in Markdown:

```html
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

<div style="text-align: center;">
  Centered text block
</div>
```

### Common Shortcuts

| Effect | Syntax | Windows / Linux | macOS |
| --- | --- | --- | --- |
| Bold | `**text**` | Ctrl + B | Command + B |
| Italic | `*text*` | Ctrl + I | Command + I |
| Inline code | `` `code` `` | Ctrl + Shift + ` | Command + Shift + ` |
| Insert link | `[text](url)` | Ctrl + K | Command + K |
| Insert image | `![alt](path)` | Ctrl + Shift + I | Command + Shift + I |
