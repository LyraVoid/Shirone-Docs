---
title: 主题介绍
permalink: /guide/intro/
createTime: 2026/08/31 20:54:13
---

# 主题介绍

让文字染上色彩，让每一次翻页都像小小的魔法开始。

欢迎使用 Shirone 博客主题。

Shirone 是一个基于 M3E 规范、富有表现力的现代化二次元个人静态博客主题。

这里的魔法并不是堆叠繁复的特效，而是藏在会随光线与心情变化的动态色彩里，藏在不打断阅读氛围的无刷新翻页间，也藏在让个人小天地慢慢鲜活起来的细节中。

无论是撰写深度技术长文、生活随笔与瞬间，还是展示追番记录、摄影相册、友链天地、开源项目、技能雷达与成长时间线，Shirone 都能提供优雅、流畅且克制的表达空间。

---

## 核心特性

<CardGrid>
  <Card title="动态配色" icon="ri:palette-line">
    基于 HCT 色彩空间与 Material Color Utilities 的动态配色系统，支持从横幅壁纸实时提取主题色，内置 8 大调色板与 25 种以上颜色角色。
  </Card>
  <Card title="平滑切页" icon="ri:flashlight-line">
    基于 Swup 的无刷新平滑切页，外围应用框架在翻页时保持运行，音乐播放器与侧边栏状态不会中断。
  </Card>
  <Card title="内容排版扩展" icon="ri:book-open-line">
    内置 Expressive Code 增强代码块、KaTeX 数学公式、Mermaid 图表、提示容器、标签页、时间线与媒体画廊。
  </Card>
  <Card title="零额外负担" icon="ri:shield-check-line">
    SSR 优先，支持键盘导航无障碍访问。可选功能在关闭时做到零外部请求、零 DOM 占位与零打包体积占用。
  </Card>
  <Card title="行为与内容分层" icon="ri:stack-line">
    配置管理行为与开关，数据管理内容实体，结构清晰，杜绝配置与内容混杂。
  </Card>
  <Card title="内容分离生态" icon="ri:git-branch-line">
    支持主题代码与独立内容仓库解耦，配合 YAML 增量覆盖层与命令行工具链，使主题版本升级平滑无阻。
  </Card>
</CardGrid>

---

## 官方仓库与社区

<CardGrid>
  <RepoCard repo="LyraVoid/Shirone" />
  <RepoCard repo="LyraVoid/Shirone-Content" />
</CardGrid>

- 在线预览：[shirone.mysqil.com](https://shirone.mysqil.com/)
- 代码仓库：[LyraVoid/Shirone](https://github.com/LyraVoid/Shirone)
- 交流社区：欢迎加入交流群与其他使用者探讨交流。

::: collapse 不了解 Astro？
Astro 是专为内容驱动型网站设计的现代 Web 框架。它通过创新的孤岛架构最大程度减少客户端 JavaScript 开销，提供出色的页面加载速度与搜索引擎优化表现。

Shirone 充分利用了 Astro 的静态构建能力，配合 Svelte 5 与 Tailwind CSS 4 构建高交互组件，兼具性能与美观。
:::

---

## 下一步

- 前往 [快速开始](/guide/get-started/)：了解环境要求、本地安装运行与基础配置
