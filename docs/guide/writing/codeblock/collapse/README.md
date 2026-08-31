---
title: 代码折叠与复制
createTime: 2026/08/31 23:23:00
permalink: /guide/writing/codeblock/collapse/
---

为了避免冗长的样板代码或超长配置文件占据过多版面，Shirone 提供了代码折叠行指令与一键复制功能。

## 代码折叠（collapse）

在元数据中使用 `collapse={起始行-结束行}` 指定默认折叠的代码范围：

````markdown
```typescript collapse={4-8} title="长配置文件示例"
import { defineUserConfig } from 'astro/config';

export default defineUserConfig({
  // 折叠部分开始
  site: 'https://shirone.mysqil.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  // 折叠部分结束
  integrations: [],
});
```
````

被折叠的行在初次加载时显示为「展开 N 行」的交互按钮，读者点击后平滑展开完整内容。

## 一键复制代码

所有渲染的代码块在右上角均内置了优雅的一键复制按钮：
- 点击后自动将代码原始内容写入系统剪贴板。
- 复制成功后呈现微动效提示。
- 保证复制出的文本是纯净代码，绝不包含行号或标记字符。
