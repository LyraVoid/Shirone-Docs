---
title: npm 包
createTime: 2026/09/05 12:00:00
permalink: /guide/npm-package/
---

Shirone 除了可以直接克隆源码运行，还以 ==`shirones`== npm 包的形式发布。npm 包模式无需克隆仓库、无需预装 Astro 脚手架，在任意空文件夹里执行一条命令即可初始化一个完整博客——路由、布局、组件、样式与 Markdown 管线全部由包提供。

## 两种使用方式对比

| | 源码模式 | npm 包模式 |
| :--- | :--- | :--- |
| 获取方式 | `git clone` 主题仓库 | `npx shirones init` |
| 内容与配置目录 | `src/content/`、`src/config/` | `shirones/content/`、`shirones/config/` |
| 主题代码 | 随仓库检出，可直接修改 | 来自 `node_modules` 中的包 |
| 主题升级 | `git pull` 合并 | 升级 `shirones` 依赖版本 |
| 覆盖组件 | `src/components/` | `src/components/`（一致） |

::: tip 适合谁
npm 包模式适合希望与主题代码完全解耦、把博客当作「普通依赖」来管理的用户；喜欢直接改动主题源码的用户建议继续使用源码模式。
:::

## 环境要求

- [Node.js](https://nodejs.org/) ==**22.12** 或更高版本==
- [pnpm](https://pnpm.io/)（推荐，也支持 npm 与 yarn）

## 快速开始

```bash
mkdir my-blog
cd my-blog
npx shirones init
pnpm dev
```

启动成功后，在浏览器中打开 `http://localhost:4321` 即可看到站点。

::: tip 无需预装 Astro
`init` 会自动写入 `package.json`，并安装 `astro`、主题及其全部 peer 依赖，因此不需要先执行 `pnpm create astro`，也不必手动安装任何依赖。
:::

## `init` 做了什么

首次在空文件夹中运行 `npx shirones init` 时，会依次完成：

1. 生成 `astro.config.mjs`，注册主题集成（若已有未注册主题的 Astro 配置，会被备份后替换）；
2. 生成 `shirones/` 目录，包含类型化配置、示例文章与静态资源；
3. 生成 `src/content.config.ts`，注册内容集合；
4. 合并 `public/` 静态资源（favicon、横幅、演示图片等，==不覆盖已有文件=={.tip}）；
5. 写入根文件（`.gitignore`、`.env.example`、`pagefind.yml` 等），同样不覆盖已有文件；
6. 写入 `tsconfig.json`，配置主题路径别名（`@/`、`@components/` 等）；
7. 写入 `package.json`（依赖与 `dev`/`build`/`preview` 脚本），并批准 `sharp`、`esbuild` 的安装脚本；
8. 自动安装全部依赖。

## 项目结构

```text
my-blog/
├── astro.config.mjs        # 唯一的 Astro 配置
├── src/
│   ├── content.config.ts   # 一行：defineCollections()
│   ├── components/         # 放同名文件即可覆盖主题组件
│   └── layouts/            # 同理覆盖主题布局
├── shirones/
│   ├── config/             # 类型化站点配置
│   │   └── data/           # 友链、项目、技能、时间线……
│   └── content/            # 文章、瞬间、关于
├── public/                 # 静态资源
└── package.json
```

## 配置站点

`shirones/config/` 下的每个模块都会「遮蔽」主题同名默认配置，并保留完整的 TypeScript 类型：

```ts title="shirones/config/siteConfig.ts"
import type { SiteConfig } from "@/types/config";

export const siteConfig: SiteConfig = {
  site: "https://example.com/",
  title: "My Blog",
  themeColor: { hue: 315, fixed: false, style: "tonalSpot", spec: "2025" },
  // …
};
```

删除某个文件即可回退到主题默认值。

## 覆盖组件与布局

在 `src/components/` 或 `src/layouts/` 中镜像主题的目录结构：

```text
src/components/atoms/blog/PostCard.astro   ← 替换主题的 PostCard
src/layouts/Layout.astro                   ← 替换主题的 Layout
```

也可以在 `astro.config.mjs` 中显式声明覆盖关系：

```js title="astro.config.mjs"
shirones({
  components: {
    "atoms/blog/PostCard": "./src/components/MyPostCard.astro",
  },
})
```

完整可覆盖清单见包内 `manifest.json`。

## 撰写文章

文章放在 `shirones/content/posts/` 中，支持 Markdown 与 MDX，直接新建文件即可（npm 包模式不提供源码模式的 `pnpm new-post` 脚手架命令）。Frontmatter 字段与源码模式完全一致。

## 更新与状态检测

- 再次运行 `npx shirones init` 不会重新初始化，而是进入 ==状态检测与修复=={.tip} 模式：报告缺失或过时的文件并安全补齐，==绝不覆盖你的文件=={.tip}；
- 追加 `--force` 可强制用模板文件覆盖；
- `npx shirones info` 打印包的解析路径、内容目录与路由注入状态。

## 关于 pnpm 的构建脚本批准

pnpm 10+ 默认拒绝运行依赖的安装脚本，而主题需要 `sharp`（图片优化）与 `esbuild`（加载 TypeScript 配置）两个。`init` 会把批准项写入 `pnpm-workspace.yaml` 后再安装，因此正常流程不会遇到 `ERR_PNPM_IGNORED_BUILDS`；只有当你在运行 `init` 之前手动 `pnpm add shirones` 时才会看到该报错，此时执行一次 `npx shirones init` 再 `pnpm install` 即可。

## 部署

npm 包模式与源码模式的部署方式完全一致：在 `shirones/config/siteConfig.ts` 中设置 `site` 与 `base`，然后运行：

```bash
pnpm install --frozen-lockfile
pnpm build
```

托管平台构建命令填 `pnpm build`、输出目录填 `dist`，详见 [部署](/guide/deploy/vercel/)。

---

## 下一步

- 回到 [快速开始](/guide/get-started/)：查看源码模式的本地运行方式
- 查看 [项目结构](/guide/project-structure/)：理解两种模式共用的目录约定
- 前往 [基础配置](/guide/layout/site-config/)：了解站点配置项的完整说明
