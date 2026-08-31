---
title: 代码选项组
createTime: 2026/08/31 23:24:00
permalink: /guide/writing/codeblock/tabs/
---

代码选项组（Tabs）用于在同一区域并排切换展示不同包管理器命令（pnpm / npm / yarn / bun）、多种编程语言实现或不同操作系统的配置步骤。

## 语法格式

使用 `::: tabs` 容器与 `@tab` 分割子标签页：

````markdown
::: tabs#package-managers

@tab pnpm#pnpm

```bash
pnpm install
pnpm build
```

@tab npm#npm

```bash
npm install
npm run build
```

@tab Bun#bun

```bash
bun install
bun run build
```

:::
````

## 默认激活与跨块联动

- **指定激活项**：使用 `@tab:active` 显式设置默认选中的标签页。
- **全局同步联动**：在同一页面中，拥有相同 `#id` 的选项卡（例如全站的 `#pnpm` 与 `#npm`）在用户点击一次后会自动全局联动切换。
- **无障碍支持**：完全支持左右方向键键盘导航切换标签页。
