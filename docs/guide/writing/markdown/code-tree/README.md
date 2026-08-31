---
title: 代码树
createTime: 2026/08/31 23:14:00
permalink: /guide/writing/markdown/code-tree/
---

代码树是一个将「左侧文件树导航」与「右侧代码高亮展示」无缝结合的高级复合组件，非常适合展示多文件工程示例与组件封装结构。

## 容器语法

在 `code-tree` 容器内包裹多个带有 `title` 属性的代码块：

````markdown
::: code-tree{title="按钮组件封装" entry="Button.svelte" height="380px"}

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

## 本地目录直接导入语法

Shirone 支持直接通过文件路径导入本地工程目录生成代码树：

```markdown
@[code-tree title="站点基础配置" entry="siteConfig.ts"](/src/config)
```

## 交互特性

- **双栏联动**：点击左侧树状结构中的任意文件名，右侧代码区即时切换至对应的文件内容与语法高亮。
- **默认入口**：通过 `entry="filename"` 指定页面首次加载时默认激活展示的文件。
- **自适应滚动**：高度与滚动条经过无障碍与移动端优化，保持阅读舒适。
