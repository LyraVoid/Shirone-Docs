---
title: 文件夹方案（推荐）
createTime: 2026/09/01 02:15:00
permalink: /guide/writing/organization/folder/
---

文件夹方案是 Shirone 博客系统==**最为推崇且最佳实践**==的文章组织方式。

在此方案中，每篇文章都拥有一个独立的文件夹，以 `index.md`（或 `index.mdx`）作为正文入口，并将文章专属的封面、插图、流程图或静态附件就近存放（Co-location）。

::: tip 彻底告别外部图床
使用文件夹方案，你的所有图片与文章一同保存在本地/Git 仓库中，无需依赖任何第三方公用图床，享受 100% 的数据自主权与永久稳定性。
:::

---

## 目录结构

在 `src/content/posts/`（或内容分离模式下的内容仓 `posts/`）中创建以文章别名（slug）命名的独立文件夹：

::: file-tree

- src
  - content
    - posts
      - deep-learning-notes
        - index.md
        - cover.webp
        - loss-curve.png
        - model-architecture.svg
      - building-custom-theme
        - index.md
        - cover.jpg
        - demo.mp4
        - assets
          - code-snippet.ts
          - benchmark.json

:::

---

> [!TIP]
> **推荐组织实践**
> 将配图与 `index.md` 放置于同一目录内，使用相对路径 `./cover.webp` 引用。移动或归档文章时资源一体化迁移，彻底杜绝孤儿静态资源。

## 相对路径引用图片

在文件夹方案中，图片直接存放在 `index.md` 的同级目录或子目录中，可以使用干净的**相对路径**直接引用：

### 1. Frontmatter 封面图

```markdown title="src/content/posts/deep-learning-notes/index.md"
---
title: 深度学习模型训练笔记
published: 2026-09-01
description: 记录一次完整的模型训练与超参数调优过程。
category: 人工智能
tags: [PyTorch, Deep Learning]
image: ./cover.webp
pinned: true
draft: false
---
```

### 2. 正文插图

在正文中，直接使用相对路径即可插入同级或子文件夹下的图片：

```markdown
# 损失函数收敛曲线

以下是经过 100 轮 Epoch 后的损失曲线分析：

![收敛曲线](./loss-curve.png)

模型整体架构示意图如下：

![架构示意图](./model-architecture.svg)
```

---

## 为什么强烈推荐文件夹方案？

| 维度 | 文件夹方案（自托管打包） | 第三方公共图床 |
| --- | --- | --- |
| **数据控制权** | **100% 自主控制**，与文章 Git 历史一同版本化 | 依赖第三方云服务商，受平台政策制约 |
| **稳定性与防盗链** | **永久稳定**，与站点部署产物同源直出 | 存在被封禁、防盗链拦截、失效或服务终止风险 |
| **图片构建优化** | Astro 构建期自动 WebP 压缩、生成 `srcset` 响应式图片 | 通常以原始格式加载，缺乏深度优化 |
| **RSS 订阅渲染** | 构建脚本自动将相对路径解析为带域名的绝对直链 | 依赖外部直链，容易出现跨域拦截 |
| **维护与清理** | 删除或归档文章时，只需删除对应文件夹即可清理所有废弃素材 | 删除文章后，图床中的废弃图片极难检索清理 |
| **离线可用性** | 断网或离线编写时本地完全可预览与渲染 | 断网无法加载图片 |

---

## 路由生成规则

- **URL 映射**：文件夹名称即为文章路由。例如 `posts/deep-learning-notes/index.md` 生成的访问链接为 `/posts/deep-learning-notes/`。
- **重命名极其安全**：修改文件夹名称即可同步更新 URL 路径，且文件夹内的图片相对引用完全不受影响。

---

## 最佳实践与排版建议

1. **封面图命名**：推荐在文件夹内统一命名为 `cover.webp` 或 `cover.png`，易于维护和脚本识别。
2. **多图片子目录**：当文章插图超过 10 张时，建议在文章文件夹下创建 `images/` 或 `assets/` 子目录，保持目录整洁：
   ```text
   article-name/
   ├── index.md
   ├── cover.webp
   └── images/
       ├── step-1.png
       ├── step-2.png
       └── step-3.png
   ```
3. **格式推荐**：插图尽量使用现代化高效的 `.webp` 格式，矢量图使用 `.svg`，兼顾清晰度与极佳的页面加载速度。
