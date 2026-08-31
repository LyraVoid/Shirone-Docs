---
title: Highlights & Diffs
createTime: 2026/08/31 23:22:00
permalink: /en/guide/writing/codeblock/diff/
---

Shirone supports line-level highlighting, insertion markers (ins), and deletion markers (del) directly within code blocks.

## Line Highlighting

Specify line numbers or ranges in curly braces `{1,3-5}`:

````markdown
```typescript {2,4-5} title="src/index.ts"
function setup() {
  const isEnabled = true; // Line 2 highlighted
  const count = 0;
  console.log("Ready");   // Lines 4-5 highlighted
  return count;
}
```
````

## Diff Annotations (ins / del)

Use `ins={...}` for inserted lines (green accent) and `del={...}` for removed lines (red accent):

````markdown
```typescript ins={3} del={2} title="Updating Config"
export const siteConfig = {
  themeColor: 210, // Old value
  themeColor: 315, // New value
};
```
````

## Standard Diff Language Blocks

You can also use standard `diff` syntax with leading `+` and `-`:

````markdown
```diff title="git diff"
- const oldVersion = "1.0.0";
+ const newVersion = "2.0.0";
```
````
