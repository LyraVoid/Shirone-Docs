---
title: Math & Formulas
createTime: 2026/08/31 23:03:00
permalink: /en/guide/writing/markdown/math/
---

Shirone integrates the KaTeX mathematical typesetting engine, delivering high-performance server-side rendering for inline and block formulas.

## Inline Formulas

Wrap TeX expressions with single dollar signs `$`:

```markdown
Mass-energy equivalence is $E = mc^2$.

Euler's identity: $e^{i\pi} + 1 = 0$.
```

## Block Formulas

Wrap standalone equations with double dollar signs `$$`:

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

Matrices and multi-line equations:

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

## Benefits

- **Server-Side Rendered**: Math expressions are pre-rendered into HTML and MathML at build time with zero client JavaScript runtime overhead.
- **Dynamic Theming**: Adapts smoothly to active HCT color tokens and dark mode.
