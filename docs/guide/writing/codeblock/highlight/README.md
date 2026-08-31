---
title: 语法高亮与行号
createTime: 2026/08/31 23:20:00
permalink: /guide/writing/codeblock/highlight/
---

Shirone 深度集成了 Expressive Code 引擎，提供基于 Shiki 的专业级静态语法着色与行号管理。

## 基础语法高亮

在代码块三个反引号后指定编程语言标识符：

````markdown
```typescript
interface UserProfile {
  name: string;
  avatar: string;
  themeColor: number;
}
```
````

## 显示行号（showLineNumbers）

通过在元数据中添加 `showLineNumbers` 属性强制开启行号显示：

````markdown
```rust showLineNumbers
fn main() {
    println!("Hello, Shirone!");
}
```
````

## 特性与优势

- **零客户端运行时**：所有语法高亮与行号标记在服务端完成静态预渲染，不会发生客户端样式闪烁。
- **自适应明暗配色**：代码块根据当前站点的 M3E 配色调色板与暗色模式自动调整语法前景色与背景对比度。
