---
title: 配置覆盖
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/config-overlay/
---

双仓模式下，站点配置编写在内容仓的 `config/` 目录中。主题仓在同步时读取这些 YAML 文件，与默认配置合并后生成 `src/user/user-config.ts`。无需直接修改主题源码。

## 只写要改的字段

YAML 中仅需声明需要修改的键，未声明的字段自动继承主题默认值。

```yaml title="config/site.yaml"
title: "我的技术博客"

banner:
  homeText:
    typewriter:
      speed: 150
```

上述示例仅修改了站点标题和打字机速度。横幅的其他属性及打字机的其余选项依然保持默认值。

这种机制可保证升级平滑：当主题后续版本新增配置项时，站点会自动采用新的默认值，避免因旧配置写死全部字段而产生布局错乱。

## 对象合并与数组替换

配置合并规则按数据类型区分：

| 类型 | 规则 |
| --- | --- |
| 嵌套对象 | 递归合并，仅覆盖显式声明的子键 |
| 数组 | 整体替换，完全以用户声明的列表为准 |

数组采用整体替换，是因为列表元素的增删与顺序往往构成一个整体，局部追加容易产生意图歧义。因此在修改 `nav-bar.yaml`、`sidebar.yaml` 等包含数组的文件时，请列出完整列表。

```yaml title="config/sidebar.yaml"
components:
  - "profile"
  - "toc"
  - "recent-posts"
  - "tags"
```

该配置会直接**替换**默认的组件列表，而非在其后追加四项。

## 校验与生效

完成配置修改后，在主题仓运行校验命令：

```bash
pnpm content:validate
```

命令会在不写入 `src/` 的前提下检查目录结构、挂载冲突与 YAML 字段类型。字段拼写错误时会给出针对性提示，例如将 `title` 误写为 `titel`：

```text
config/site.yaml's banner.homeText: Type '{ titel: string }' is not assignable to type 'DeepPartial<HomeTextConfig>'
  Did you mean "title"?
```

配置在以下两种场景下正式生效：

- 执行 `pnpm content:sync` 时，YAML 文件被编译输出至 `src/user/user-config.ts`；
- 执行 `pnpm build` 或 `pnpm dev` 时，前置自动触发同步。

`src/user/user-config.ts` 为构建期生成文件，每次同步均会被覆盖，切勿手动编辑。编译过程还会完成两项辅助工作：将配置中引用的图标打包至本地，并将站点标题、昵称等文本纳入字体子集，避免额外的网络请求或文字缺字。

## 配置文件分类

`config/` 目录下的配置文件按职责划分为四组。

**基础与外观**

| 文件 | 内容说明 |
| --- | --- |
| `site.yaml` | 站点名称、域名、主题色、横幅、背景纹理 |
| `profile.yaml` | 头像、昵称、签名、社交链接 |
| `nav-bar.yaml` | 顶部导航菜单 |
| `sidebar.yaml` | 侧栏布局与组件顺序 |
| `font.yaml` | 字体与字体子集化 |
| `footer.yaml`、`footer.html` | 页脚文案与自定义 HTML 注入 |
| `image-bloom.yaml`、`context-menu.yaml` | 图片辉光、右键增强菜单 |

**文章与列表**

| 文件 | 内容说明 |
| --- | --- |
| `article.yaml` | 阅读时长、更新提示、相关推荐、分享海报 |
| `post-list.yaml` | 列表分页大小与卡片展示方式 |
| `permalink.yaml` | 文章永久链接格式 |
| `license.yaml` | 版权声明协议 |
| `expressive-code.yaml` | 代码块高亮主题与行号 |

**页面与功能**

| 文件 | 内容说明 |
| --- | --- |
| `anime.yaml` | 番剧数据源配置 |
| `music.yaml` | 音乐播放器 |
| `comment.yaml` | 评论系统 |
| `announcement.yaml`、`fab.yaml` | 公告栏、悬浮操作按钮 |
| `umami.yaml`、`llms.yaml` | 访问统计、大模型检索输出 |
| `devices.yaml`、`games.yaml`、`projects.yaml`、`skills.yaml`、`timeline.yaml`、`friends.yaml`、`series.yaml` | 各独立页面的分类与筛选规则 |

每个字段的详细配置请参阅对应功能的文档页，例如导航见[导航栏配置](/guide/layout/navbar/)，评论见[评论系统](/guide/article/comments/)。

::: warning 番剧配置需拉取数据
`config/anime.yaml` 仅用于声明账号与数据源。修改后需运行 `pnpm anime:sync --if-stale` 下载追番数据与封面，否则页面将无数据展示。构建阶段建议执行 `pnpm anime:sync --if-stale && pnpm build`，详见[番剧页](/guide/pages/anime/)。
:::

## 下一步

[CLI 工具链](/guide/content-separation/cli-workflows/)：同步、监听、校验、导出与清理命令。
