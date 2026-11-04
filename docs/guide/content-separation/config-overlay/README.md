---
title: 配置覆盖
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/config-overlay/
---

在单仓模式下，站点设置分散在主题源码的 TypeScript 配置文件中（如 `src/config/siteConfig.ts`）。

而在双仓分离模式下，所有配置统一存放在内容仓库的 `config/` 目录中，并使用直观易读的 YAML 格式编写。每次执行本地构建或线上打包时，Shirone 会自动读取这些 YAML 文件，与主题默认配置合并，生成最终的 `src/user/user-config.ts`。

你完全不需要改动主题代码仓库的一行代码；未来主题发布新版本时，也可以直接拉取更新，你的个性化配置不会丢失或被覆盖。

## 两条合并规则

理解配置覆盖只需掌握两条规则：

### 规则一：按需声明，只写要改的字段

在编写 YAML 配置文件时，你只需要填写自己想要定制的配置项。未在 YAML 中声明的选项，系统会自动继承主题的默认值。

例如在 `config/site.yaml` 中，如果你只想修改博客名称与主页打字机速度：

```yaml title="config/site.yaml"
title: "我的技术博客"

banner:
  homeText:
    typewriter:
      speed: 150
```

在这个例子中，横幅的背景图片、遮罩透明度以及打字机的其余选项均未提及，它们依然完整保持主题默认样式。

这种「按需覆盖」的设计带来了一个重要好处：当主题后续版本新增配置参数时，你的站点会自动使用新的默认特性，不会因为旧配置文件写死全部字段而导致样式异常。

### 规则二：对象递归合并，数组整体替换

配置项在合并时会根据其数据类型采取不同的合并策略：

| 数据类型 | 合并策略 | 运作说明 |
| --- | --- | --- |
| **对象 / 嵌套字典** | 递归合并 | 仅覆盖 YAML 中声明的子字段，未声明的同级字段保留默认值 |
| **数组 / 列表项** | 整体替换 | 只要你声明了该列表，就完全以你书写的项为准，不再保留默认列表 |

为什么数组需要整体替换？因为导航菜单或侧栏小组件等列表项的排列顺序和启停状态是一个整体。如果系统将你的项追加到默认列表末尾，往往会导致重复项或顺序混乱。

因此，当你修改包含列表的文件（如 `config/nav-bar.yaml` 或 `config/sidebar.yaml`）时，需要列出该区域所需的完整条目：

```yaml title="config/sidebar.yaml"
# 侧栏小组件列表（整体替换默认配置）
components:
  - "profile"      # 个人卡片
  - "toc"          # 文章目录
  - "recent-posts" # 最新文章
  - "tags"         # 标签云
```

## 常用核心配置文件

在内容仓库的 `config/` 目录下，最常用到的核心配置文件包括以下几类：

### 1. 站点基础与外观 (`config/site.yaml`)

用于设定博客基础标识、域名、主题色系及主页横幅：

```yaml title="config/site.yaml"
title: "Shirone"
subtitle: "简约优雅的静态博客"
description: "记录技术笔记与生活实践"
site: "https://example.com"

# 主题品牌主色（十六进制颜色代码）
primaryColor: "#3B82F6"

# 主页横幅与打字机动效
banner:
  enable: true
  homeText:
    enable: true
    title: "你好，旅行者"
    subtitle:
      - "欢迎来到我的个人博客"
      - "很高兴与你在这里相遇"
```

完整可用字段请参阅[站点配置指南](/guide/config/site/)。

### 2. 个人信息卡片 (`config/profile.yaml`)

用于展示在侧边栏和页脚的站长名片、头像、社交链接：

```yaml title="config/profile.yaml"
avatar: "https://github.com/你的用户名.png"
name: "你的昵称"
bio: "一名热爱开源的前端开发者"

# 社交媒体链接列表（图标名称支持 Iconify 图标库）
socialLinks:
  - name: "GitHub"
    icon: "ri:github-line"
    url: "https://github.com/你的用户名"
  - name: "Bilibili"
    icon: "ri:bilibili-line"
    url: "https://space.bilibili.com/你的UID"
```

### 3. 顶部导航栏 (`config/nav-bar.yaml`)

配置博客顶部的导航链接与下拉菜单。列表采用整体替换规则：

```yaml title="config/nav-bar.yaml"
links:
  - title: "首页"
    url: "/"
    icon: "ri:home-4-line"
  - title: "归档"
    url: "/archives/"
    icon: "ri:archive-line"
  - title: "关于"
    url: "/about/"
    icon: "ri:user-3-line"
```

详见[导航栏配置](/guide/layout/navbar/)。

### 4. 独立页面与功能配置

针对博客的各类拓展页面，修改对应名称的 YAML 文件即可启用：

- **评论系统 (`config/comment.yaml`)**：支持 Twikoo、Waline 等评论后端，详见[评论系统配置](/guide/article/comments/)；
- **番剧追踪 (`config/anime.yaml`)**：配置 Bilibili 或 Bangumi 账号同步追番进度，详见[番剧页配置](/guide/pages/anime/)；
- **音乐播放器 (`config/music.yaml`)**：配置全局背景音乐歌单，详见[音乐播放器](/guide/plugins/music/)；
- **友链页面 (`config/friends.yaml`)**：友情链接分组与卡片列表。

::: tip 追番数据同步提醒
修改 `config/anime.yaml` 中的账号后，需要运行 `pnpm anime:sync --if-stale` 下载追番数据与封面缓存，页面才会有内容展示。
:::

## 配置文件完整速查

除上述核心文件外，`config/` 目录下的其他配置文件对应功能如下：

| 分组 | 文件名 | 主要作用 |
| --- | --- | --- |
| 视觉与字体 | `font.yaml` | 字体家族定义与字体子集化优化 |
| 页面底部 | `footer.yaml`、`footer.html` | 页脚版权文案与自定义 HTML 注入 |
| 视觉微调 | `image-bloom.yaml`、`context-menu.yaml` | 图片边缘辉光效果、自定义右键菜单 |
| 阅读体验 | `article.yaml` | 文章阅读时长估算、更新提示、推荐阅读 |
| 列表展示 | `post-list.yaml` | 文章列表分页大小与卡片展示样式 |
| 链接规范 | `permalink.yaml` | 文章 URL 永久链接结构规范 |
| 代码显示 | `expressive-code.yaml` | 代码块语法高亮主题与行号开关 |
| 页面独立卡片 | `devices.yaml`、`games.yaml`、`projects.yaml`、`skills.yaml` | 装备、游戏、开源项目与个人技能页的数据源 |

## 校验与生效机制

### 语法与类型校验

在修改配置文件后，你可以在主题代码仓运行校验命令，检查是否存在格式或拼写错误：

```bash
pnpm content:validate
```

该命令会在不改动任何项目文件的前提下进行干运行（Dry-run），核对 YAML 的语法规范与数据类型。如果你不小心把 `title` 误拼为 `titel`，命令会明确提示错误位置和推荐修复：

```text
config/site.yaml's banner.homeText: Type '{ titel: string }' is not assignable to type 'DeepPartial<HomeTextConfig>'
  Did you mean "title"?
```

### 配置如何生效

配置文件在以下两个场景会自动编译并生效：

1. **执行构建或本地运行**：每次运行 `pnpm dev` 或 `pnpm build` 时，系统会自动前置执行同步命令；
2. **手动同步**：执行 `pnpm content:sync`，系统会读取所有 YAML 文件，并在主题代码仓编译生成 `src/user/user-config.ts`。

`src/user/user-config.ts` 是构建过程中自动生成的文件，每次同步都会被全量重写，请勿手动编辑该文件。

## 下一步

- [CLI 工具链](/guide/content-separation/cli-workflows/)：了解同步、监听与状态检查命令
- [站点基础配置](/guide/config/site/)：查看全量站点配置项说明
- [导航栏配置](/guide/layout/navbar/)：深入学习菜单多级下拉与图标配置
