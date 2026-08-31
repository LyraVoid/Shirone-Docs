---
title: 文章加密
createTime: 2026/08/31 23:15:00
permalink: /guide/writing/encryption/
---

Shirone 支持文章级密码保护：构建期把正文加密进静态 HTML（零明文输出），读者输入密码后在浏览器本地解密。适合私密日记、付费内容预告等场景。

## 快速开始

在 frontmatter 中加密码即可：

```yaml title="src/content/posts/private-diary.md"
---
title: 私密日记
published: 2026-08-26
tags: [日记]
encrypted: true
password: "my-secret-password"
passwordHint: "提示：我的生日"
hideHomeContent: true
---
```

字段说明：

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `encrypted` | `boolean` | 否 | `false` | 显式标记加密。设置 `password` 时隐式为 `true` |
| `password` | `string` | 是 | 无 | 构建期加密、运行时解锁的明文密码 |
| `passwordHint` | `string` | 否 | `""` | 密码输入框下方的提示 |
| `hideHomeContent` | `boolean` | 否 | `true` | 在首页/归档卡片与 RSS 中隐藏摘要与字数 |

## 安全架构

加密系统与受保护相册共享同一套安全基础：

1. **静态产物零明文**：Astro SSG 构建时，正文先编译为 HTML，随即用 AES-256-GCM 加密后才输出页面——发布的静态 HTML 中不含任何正文与大纲明文
2. **认证加密 + 范围绑定**：密钥派生遵循 OWASP 建议（310,000 次 PBKDF2 迭代 + 16 字节随机盐）；每次加密生成独立 12 字节随机 IV；附加认证数据（AAD）绑定 `shirone-protected-content:1:post:${slug}`——密文无法跨文章重放
3. **会话持久化、密码零落盘**：解密内容缓存在浏览器会话存储（30 分钟过期）；明文密码永不写入磁盘；解密状态跨 Swup 站内导航与页面刷新保持
4. **全站防泄漏**：
   - 搜索索引（Pagefind）与搜索引擎抓不到明文
   - RSS 输出本地化占位符，聚合器拉不到正文
   - `hideHomeContent: true` 时首页与归档卡片的摘要、字数被遮蔽
   - 目录（TOC）在解锁前保持隐藏，解密后动态重建

## 解锁后的体验

解密与运行时协助器协调，动态挂载语法高亮、代码折叠、Mermaid 图表、LaTeX 公式与图片灯箱——加密文章与普通文章拥有完全一致的增强能力。

## 适用边界

::: warning 安全边界
静态客户端加密用于防止未授权浏览与自动化索引。涉及关键商业秘密时，请使用服务端鉴权方案。

同时注意：**静态加密没有集中式服务器数据库，密码遗忘后内容无法恢复。** 请务必妥善保存密码。
:::

## 实战示例

**私密随笔（带提示）**

```yaml
---
title: 只给朋友看的随笔
published: 2026-08-26
password: "our-shared-secret"
passwordHint: "我们常去的那家咖啡店"
---
```

`encrypted` 可省略——设置 `password` 即隐式启用。

**预告式付费内容**

```yaml
---
title: 深度教程（完整版）
published: 2026-08-26
encrypted: true
password: "subscribed-only"
passwordHint: "订阅后通过邮件获取密码"
hideHomeContent: false
---
```

`hideHomeContent: false` 保留摘要展示——读者能看到文章简介，正文解锁后才可见，作为订阅引导。

## 常见问题

**密码正确但解不开**

确认没有多余空格（YAML 字符串建议加引号）；构建后改过密码的必须重新构建——密文在构建期生成，改 frontmatter 不重新构建不会生效。

**忘记密码怎么办**

无法恢复。静态加密没有服务端数据库。用原始 Markdown 源文件（未加密的源文件仍在 `src/content/posts/` 中明文存在）重新构建即可重置。

**加密文章会被搜索到吗**

正文不会。Pagefind 与搜索引擎只能拿到加密后的占位内容；标题、标签等元数据仍然公开（它们用于列表展示）——不要把敏感信息写进标题。

**加密会影响性能吗**

对普通读者无影响——加密文章的解密只发生在输入密码之后，且 30 分钟会话内不重复解密。未加密文章完全不涉及加密代码路径。
