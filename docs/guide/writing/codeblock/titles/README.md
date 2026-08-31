---
title: 标题与文件名
createTime: 2026/08/31 23:21:00
permalink: /guide/writing/codeblock/titles/
---

通过在代码块元数据中添加 `title="..."` 属性，可以为代码块生成带有文件类型图标的窗口顶栏与文件名标识。

## 语法格式

在代码围栏首行指定 `title`：

````markdown
```json title="package.json"
{
  "name": "shirone",
  "version": "1.0.0"
}
```
````

或者为多步骤操作指定提示性标题：

````markdown
```bash title="终端操作命令"
pnpm install
pnpm dev
```
````

## 视觉与特性

- 顶栏左侧自动渲染操作系统风格的窗口控制按钮与文件扩展名专用图标。
- 顶栏右侧自动放置快速复制代码按钮与折叠控制入口。
- 文件名标签清晰明确，避免读者混淆代码存放路径。
