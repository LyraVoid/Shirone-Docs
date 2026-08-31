---
title: Code Tree
createTime: 2026/08/31 23:14:00
permalink: /en/guide/writing/markdown/code-tree/
---

The code tree component combines an interactive file tree navigation on the left with synchronized syntax-highlighted code blocks on the right.

## Container Syntax

Wrap multiple titled code blocks inside `::: code-tree`:

````markdown
::: code-tree{title="Button Component" entry="Button.svelte" height="380px"}

```svelte title="Button.svelte"
<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button class="btn btn-{variant}">
  <slot />
</button>
```

```ts title="types.ts"
export type ButtonVariant = 'primary' | 'secondary';
```

:::
````

## Directory Import Syntax

Import an existing directory from your repository to generate a code tree automatically:

```markdown
@[code-tree title="Site Configurations" entry="siteConfig.ts"](/src/config)
```

## Interactions

- **Synchronized View**: Clicking files in the tree immediately switches code panes on the right.
- **Entry File**: Set `entry="filename"` to specify which file is selected on page load.
- **Accessible Layout**: Optimized scrolling and keyboard navigation for desktop and mobile.
