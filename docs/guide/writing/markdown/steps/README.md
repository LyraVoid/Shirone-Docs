---
title: 步骤引导
createTime: 2026/08/31 23:12:00
permalink: /guide/writing/markdown/steps/
---

步骤引导容器 `steps` 用于编写安装指南、配置教程或操作流程，将原本扁平的有序数字列表渲染为带有连线与徽章的视觉流程图。

## 语法格式

使用 `::: steps` 容器包裹标准 Markdown 有序列表：

````markdown
::: steps{title="快速上手三步曲"}

1. **安装环境依赖**

   确保本地 Node.js 版本满足 `>= 22.12`，并安装 pnpm 包管理器。

2. **克隆并初始化仓库**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   cd Shirone
   pnpm install
   ```

3. **启动本地开发服务器**

   运行 `pnpm dev` 并在浏览器中访问 `http://localhost:4321`。

:::
````

## 渲染特性

- 序号圆圈与竖向引导连线完全由 CSS 伪元素与 Material 3 令牌驱动，语义结构保持为标准的 `<ol>` 列表。
- 支持在每个步骤内部自由嵌套段落、代码块、提示容器或图片。
