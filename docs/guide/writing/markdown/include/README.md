---
title: 文件片段导入
createTime: 2026/08/31 23:16:00
permalink: /guide/writing/markdown/include/
---

文件片段导入语法允许在当前 Markdown 文章中引入其他文件的完整内容、行号切片或命名区块，极大提升长篇教程与公共配置文档的复用效率。

## 引入完整文件

在文章中使用注释指令：

```markdown
<!-- @include: ../snippets/prerequisites.md -->
```

## 按行号切片引入

只引入目标文件的第 10 到 25 行：

```markdown
<!-- @include: ../../src/config/siteConfig.ts{10-25} -->
```

## 按命名区块（Region）引入

在源码中使用 `#region` 和 `#endregion` 标记公共区块：

```typescript title="src/example.ts"
// #region auth-config
export const authConfig = {
  enabled: true,
  provider: 'github',
};
// #endregion
```

在 Markdown 中精准导入该区块：

```markdown
<!-- @include: ../../src/example.ts#auth-config -->
```

## 构建特性

- 所有的片段嵌入均在构建编译期完成，输出标准的静态 AST 节点。
- 零运行时开销，代码高亮与行号完全同步生效。
