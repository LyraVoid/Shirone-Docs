---
title: 代码选项组
createTime: 2026/08/31 23:35:00
permalink: /guide/writing/markdown/tabs/
---

代码选项组（Tabs / Code Group）用于在同一卡片中并排切换展示多种编程语言、包管理器命令或不同环境的操作指南。

## 语法格式

使用 `::: tabs` 容器与 `@tab` 分割子选项卡：

````markdown
::: tabs#package-managers

@tab pnpm#pnpm

```bash
pnpm install
pnpm dev
```

@tab npm#npm

```bash
npm install
npm run dev
```

@tab Bun#bun

```bash
bun install
bun dev
```

:::
````

## 核心特性

- **默认激活**：使用 `@tab:active` 显式标记初次加载默认选中的选项卡。
- **全局同步**：全站相同 `#id` 的选项卡（如 `#pnpm`）点击切换时会自动保持联动同步。
- **键盘导航**：完全支持左右方向键切换焦点。
