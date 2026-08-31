---
title: 数学公式
createTime: 2026/08/31 23:03:00
permalink: /guide/writing/markdown/math/
---

Shirone 集成了 KaTeX 数学排版引擎，支持行内公式与独立块级公式的高性能服务端静态渲染。

## 行内公式

使用单个美元符号 `$` 包裹 TeX 公式：

```markdown
质能守恒方程为 $E = mc^2$。

欧拉恒等式为 $e^{i\pi} + 1 = 0$。
```

## 块级公式

使用双美元符号 `$$` 包裹独立公式块：

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

或者矩阵与联立方程：

```markdown
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$
```

## 优势与特性

- **SSR 静态生成**：公式在构建阶段直接渲染为轻量 HTML 与 MathML 标记，无需在客户端动态加载庞大的 JavaScript 渲染引擎。
- **动态配色跟随**：公式符号与背景色自动适配当前主题的 HCT 调色板与暗色模式。
