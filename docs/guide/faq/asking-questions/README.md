---
title: 提问与反馈
createTime: 2026/09/01 01:01:00
permalink: /guide/faq/asking-questions/
---

向主题仓库提交 Issue 或参与讨论之前，先读完这一页——一个可复现、信息完整的问题报告能让维护者在几分钟内定位问题；反之，「用不了」「有 bug」这类描述谁也帮不了你。

## 提问前的检查清单

- [ ] 已读本站相关文档页与其 FAQ
- [ ] 已跑通[错误排查](/guide/faq/troubleshooting/)的通用手段
- [ ] 确认主题为最新版本（建议先更新到最新版本排查）
- [ ] 问题可在干净环境复现（新克隆的主题 + 最小改动）

## 什么样的 Issue 会被欢迎

来自主题仓库 CONTRIBUTING.md 的欢迎清单：

- **可复现的 bug 报告**
- 文档与翻译改进
- 无障碍、响应式布局、浏览器兼容性修复
- 为既有行为补充测试
- 符合主题方向的功能提案（表达力强、内容优先的博客主题）

## 什么样的内容不该进 Issue

- 仅替换个人站点演示资料（头像/文章/友链/插画）的需求——保留在自己的 fork 中
- 大型功能、视觉重设计、破坏性配置变更、新依赖、第三方集成——**先开 Issue 或 Discussion 讨论方向**，达成一致后再实现
- 「帮我改我的博客」类请求——社区可以指点方向，但不代做个人定制

## 报告 Bug 的正确姿势

一个高质量 bug 报告包含：

::: steps

1. **标题**：一句话概括症状（如「启用评论后构建报 PBKDF2 相关错误」）
2. **环境**：Node 版本、pnpm 版本、操作系统、主题版本/commit
3. **复现步骤**：从干净状态到触发问题的每一步
4. **期望 vs 实际**：期望发生什么，实际发生了什么
5. **日志**：完整错误输出（不要只截图片段），标注你认为关键的行
6. **最小复现**：能触发问题的最小配置/内容片段

:::

## 提交 PR 之前

如果你打算直接贡献代码（欢迎！），按主题仓库的 CONTRIBUTING.md 执行：

**提交前必跑**：

```bash
pnpm format          # Biome 格式化（强制）
npx astro check      # 必须零错误
pnpm type-check      # 涉及 TS 时
pnpm build           # 涉及内容处理/字体/schema 时
```

**Commit 信息**：使用 [Conventional Commits](https://www.conventionalcommits.org/)，简洁英文主题行：

```text
feat(search): add result filters
fix(sidebar): sync widgets after navigation
docs(config): clarify music provider setup
```

**PR 描述**需说明：解决了什么问题、行为如何变化、用哪些命令验证、是否影响配置/无障碍/性能/既有内容、关闭哪个 Issue。视觉改动附前后截图与测试过的视口和主题。

**范围纪律**：每个 PR 只处理一个明确主题；不带无关的格式化或视觉改动；生成产物、测试报告、本地环境文件、凭据不入库。

## 交流渠道

- **Bug 与功能**：[GitHub Issues](https://github.com/LyraVoid/Shirone/issues)
- **方向讨论**：GitHub Discussions（大改动先来这里）
- **文档问题**：本站仓库，或随 Issue 一并指出

## 常见问题

::: collapse
- Issue 提了没人回

  检查是否缺少复现信息——维护者通常优先处理信息完整、可复现的报告。补充环境与日志往往能唤醒它。

- 想贡献翻译

  界面文案走 i18n 系统，新增 key 必须补全 `src/i18n/languages/` 下全部 10 种语言；文档翻译保持命令、路径、链接与技术含义准确。

- 我的功能提案被拒了

  主题有清晰的方向（表达力强、内容优先、零额外负担）。被拒不代表想法不好，可能只是不适合主题——可以考虑做成社区插件或 fork 自用。
:::
