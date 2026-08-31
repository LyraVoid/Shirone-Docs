---
title: Github 警报
createTime: 2026/08/31 23:10:00
permalink: /guide/writing/markdown/github-alerts/
---

Shirone 原生支持 GitHub 官方的警报块语法，无需任何指令转换即可将 GitHub Markdown 样式的引用块渲染为现代化的警报容器。

## 语法格式

使用标准引用语法 `>` 开头，首行书写大写的警报类型标记：

```markdown
> [!NOTE]
> 这是普通笔记说明，适合记录背景信息。

> [!TIP]
> 这是操作小技巧，帮助提升工作流效率。

> [!IMPORTANT]
> 核心关键配置，部署生产前请务必确认。

> [!WARNING]
> 潜在风险预警，请注意参数兼容性。

> [!CAUTION]
> 危险操作提醒，执行前请先做好数据备份。
```

## 与通用提示容器的互通性

- 内部统一转译为与提示容器相同的语义 AST 节点。
- 保证在 GitHub 仓库原生 README 预览与博客正文发布时拥有一致的排版呈现。
