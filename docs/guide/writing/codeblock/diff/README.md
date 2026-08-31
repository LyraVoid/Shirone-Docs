---
title: 高亮与差异标记
createTime: 2026/08/31 23:22:00
permalink: /guide/writing/codeblock/diff/
---

Shirone 支持对代码块中的特定行进行行高亮、新增行（insert）与删除行（delete）的视觉差异标记。

## 行高亮（行号范围）

在代码围栏首行通过 `{1,3-5}` 指定需要高亮的行号：

````markdown
```typescript {2,4-5} title="src/index.ts"
function setup() {
  const isEnabled = true; // 第 2 行高亮
  const count = 0;
  console.log("初始化完成"); // 第 4-5 行高亮
  return count;
}
```
````

## 差异标记（ins / del）

使用 `ins={...}` 标记新增行（绿色背景），`del={...}` 标记删除行（红色背景）：

````markdown
```typescript ins={3} del={2} title="更新配置"
export const siteConfig = {
  themeColor: 210, // 旧配置
  themeColor: 315, // 新配置
};
```
````

## 原生 Diff 代码块

也可以直接使用 `diff` 语言标识并以 `+` 和 `-` 作为行首字符：

````markdown
```diff title="git diff"
- const oldVersion = "1.0.0";
+ const newVersion = "2.0.0";
```
````
