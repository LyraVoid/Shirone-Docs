# Shirone Docs

[English](./README.md)

这是 [Shirone](https://github.com/LyraVoid/Shirone) 的双语文档仓库。Shirone 是一个 Astro 博客主题；本文档站使用 VuePress 与 VuePress Theme Plume 构建。

## 文档范围

- 快速开始、项目结构、部署与故障排查
- 写作、Frontmatter、Markdown 扩展、媒体嵌入、固定链接与文章加密
- 布局、独立页面、侧栏部件与特色功能配置
- 内容分离、API 集成、组件契约与主题开发指南
- 中文源文档位于 `docs/`，对应英文文档位于 `docs/en/`

## 环境要求

- Node.js `^20.19.0` 或 `>=22.0.0`
- pnpm `11.17.0`，以 `package.json` 声明为准

## 本地开发

```bash
corepack enable
pnpm install
pnpm docs:dev
```

启动后访问 VuePress 在终端输出的本地地址。若 Windows PowerShell 阻止执行脚本，请将命令改为 `pnpm.cmd`。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm docs:dev` | 启动文档开发服务器 |
| `pnpm docs:dev-clean` | 清理 VuePress 缓存后启动开发服务器 |
| `pnpm docs:build` | 构建生产站点到 `docs/.vuepress/dist/` |
| `pnpm docs:preview` | 本地预览生产构建产物 |
| `pnpm vp-update` | 更新 VuePress 与 Theme Plume 依赖 |

## 仓库结构

```text
docs/
  .vuepress/                 VuePress 与导航配置
  guide/                     简体中文文档
  en/guide/                  英文文档
  README.md                  中文文档站首页
  en/README.md               英文文档站首页
research/Shirone/            本地源码参考，不纳入 Git
```

## 编写与维护

1. 在对应语言目录创建页面目录，并添加 `README.md`。
2. 补充 `title`、`createTime` 与稳定的 `permalink` Frontmatter。
3. 面向用户的主题应同时维护中英文页面。
4. 在 `docs/.vuepress/collections.ts` 登记导航；仅创建文件不会自动出现在侧边栏。
5. 提交前构建验证：

```bash
pnpm docs:build
```

涉及行为、文件路径、配置字段和命令的内容，应以 Shirone 源码为依据，不应仅根据示例推断。

## 许可证

[MIT](./LICENSE)
