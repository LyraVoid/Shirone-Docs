---
title: 文件树
createTime: 2026/08/31 23:13:00
permalink: /guide/writing/markdown/file-tree/
---

文件树组件用于展示项目的目录与文件结构，支持自动识别文件扩展名图标、目录层级折叠以及变更状态标注。

## 语法格式

支持容器语法与代码围栏双语法：

### 容器语法

```markdown
::: file-tree{title="Shirone 目录结构"}
- src/
  - config/
    - siteConfig.ts
    - sidebarConfig.ts
  - content/
    - posts/
      - hello-world.md
  - astro.config.mjs
- package.json
- pnpm-lock.yaml
:::
```

### 围栏代码块语法

```markdown
```file-tree title="构建输出"
dist/
├── assets/
│   ├── app.js
│   └── style.css
├── index.html
└── pagefind/
```
```

## 变更状态与图标智能匹配

- **扩展名识别**：自动根据文件后缀（如 `.ts`、`.json`、`.astro`、`.md`、`.css`、`.png`）匹配对应的 Material / Devicon 图标。
- **差异标记**：支持在条目前添加 `+`（新增）、`-`（删除）、`~`（修改）等符号，自动生成带颜色的差异状态指示。
- **原生折叠**：包含子目录的节点默认支持可折叠展开交互。
