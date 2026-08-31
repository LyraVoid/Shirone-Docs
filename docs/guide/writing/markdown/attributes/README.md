---
title: 扩展与属性
createTime: 2026/08/31 23:01:00
permalink: /guide/writing/markdown/attributes/
---

Shirone 支持在 Markdown 元素后附加属性字典，为生成的 HTML 标签赋予自定义 class、id 或数据属性。

## 行内元素属性

在行内文本、链接或高亮语法后紧跟 `{}` 声明属性：

```markdown
[外部链接](https://example.com){target="_blank" rel="noopener"}

==高亮文本=={.secondary}

`code phrase`{.custom-badge}
```

## 块级元素属性

在块级容器、标题或段落后声明：

```markdown
## 自定义锚点标题 {#custom-section-id}

::: tip[自定义样式容器]{class="custom-highlight-box"}
容器内部内容
:::
```

## 常用属性简写

- `.class-name`：等价于 `class="class-name"`
- `#id-name`：等价于 `id="id-name"`
- `key="value"`：直接设定 HTML 属性
