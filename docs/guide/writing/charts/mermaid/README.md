---
title: Mermaid 图表
createTime: 2026/08/31 23:25:00
permalink: /guide/writing/charts/mermaid/
---

Shirone 原生集成了 Mermaid 图表渲染引擎，支持在 Markdown 中直接绘制流程图、时序图、甘特图、类图与状态图。

## 流程图（Flowchart）

````markdown
```mermaid
flowchart TD
    A[用户请求] --> B{路由匹配}
    B -->|命中静态文件| C[返回预渲染 HTML]
    B -->|动态路由| D[Swup 客户端平滑切页]
    C --> E[结束]
    D --> E
```
````

## 时序图（Sequence Diagram）

````markdown
```mermaid
sequenceDiagram
    autonumber
    actor User as 访客
    participant Browser as 浏览器
    participant Server as 边缘服务器

    User->>Browser: 点击文章链接
    Browser->>Server: 发起页面资源请求
    Server-->>Browser: 返回纯静态 HTML 与资源包
    Browser-->>User: 渲染文章与动态配色
```
````

## 状态图与架构图（State Diagram）

````markdown
```mermaid
stateDiagram-v2
    [*] --> 默认浅色
    默认浅色 --> 暗色模式: 切换主题
    暗色模式 --> 默认浅色: 切换主题
    暗色模式 --> [*]
```
````

## 核心特性

- **按需加载**：Mermaid 引擎仅在文章包含图表代码块时才会动态异步加载，不增加其他页面的初始打包体积。
- **色彩与主题同步**：图表线条、节点与文字颜色自动与当前站点的 Material 3 Expressive 主题色与明暗模式实时同步。
