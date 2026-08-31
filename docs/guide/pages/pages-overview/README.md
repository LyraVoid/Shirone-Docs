---
title: 独立页面总览
createTime: 2026/09/01 00:20:00
permalink: /guide/pages/pages-overview/
---

Shirone 内置一组独立的个人内容页面：关于、瞬间、友链、相册、番剧、罗盘、技能、项目、设备、时间线。本篇讲它们的整体组织方式——开关体系、导航联动与页面标识；各页面专属配置见后续分篇。

## 页面清单

| 页面 | 地址 | 数据/内容来源 | 行为配置 |
| --- | --- | --- | --- |
| 关于 | `/about/` | `src/content/spec/about.md` | 无（纯 Markdown） |
| 瞬间 | `/moments/` | `src/content/moments/*.md` | 无专属 |
| 友链 | `/friends/` | `src/data/friends.ts` | 无（数据即内容） |
| 相册 | `/albums/` | 相册数据 | 支持加密保护 |
| 番剧 | `/anime/` | `src/data/anime.ts` 或快照 | `animeConfig.ts` |
| 罗盘 | `/compass/` | `src/data/compass.ts` | 无专属 |
| 技能 | `/skills/` | `src/data/skills.ts` | `skillsConfig.ts` |
| 项目 | `/projects/` | `src/data/projects.ts` | `projectsConfig.ts` |
| 设备 | `/devices/` | `src/data/devices.ts` | `devicesConfig.ts` |
| 时间线 | `/timeline/` | `src/data/timeline.ts` | `timelineConfig.ts` |

## 开关体系：enable 与导航联动

带行为配置的页面（技能、项目、设备、时间线、番剧）共享同一套开关规则：

```ts
enable: true,   // false 时：
                // 1. 导航入口自动隐藏
                // 2. 直接访问该页地址跳转 404
```

关闭页面**无需修改导航配置**——导航入口与页面 `enable` 联动（见[导航栏配置](/guide/layout/navbar/)中 `more` 分组的条件挂载）。

纯内容页面（关于、瞬间、友链等）没有开关，页面始终存在；不想要时从导航中移除入口即可（预设条目不引用）。

## Config / Data 分层

这是理解所有页面配置的核心原则（见[基础配置](/guide/layout/site-config/#配置与数据分层原则)）：

| 判别问题 | 归属 | 位置 |
| --- | --- | --- |
| 页面是否开启？分类怎么排？单项停用？ | **Config** | `src/config/xxxConfig.ts` |
| 页面要展示的具体条目？ | **Data** | `src/data/xxx.ts` |

以技能页为例：`skillsConfig.enable` 控制页面开关、`categories` 控制筛选分类、`disabledNames` 停用单个技能；而技能的名称、熟练度、图标、描述全部在 `src/data/skills.ts`。

## 页面标识（pages）

每个页面有统一的标识，用于侧栏 widget 与 FAB 的 `pages` 过滤：

```text
home | archive | friends | moments | anime | compass | skills |
projects | devices | timeline | albums | about | post | categories | tags
```

例如公告 widget 默认 `pages: ["home"]`、悬浮目录 `pages: ["post"]`（见[侧栏布局](/guide/layout/sidebar/)与[悬浮控制流](/guide/article/fab/)）。

## 导航挂载

所有页面的地址都已登记在 `LinkPresets` 预设表。默认导航中，常用页面直接挂载，低频页面（时间线、项目、设备、技能）收进「更多」下拉分组——同样受各自 `enable` 条件控制。调整见[导航栏配置](/guide/layout/navbar/)。

## 常见问题

**关闭页面后旧链接会怎样**

直接访问返回 404。若该页面已被搜索引擎收录，建议配置 301（在托管平台层面处理）。

**页面能改地址吗**

预设中的 `url` 可在自定义链接时覆盖（如把 `/moments/` 改为 `/say/`），详见[导航栏配置](/guide/layout/navbar/)的自定义链接一节。

**新增自己的独立页面**

在 `src/pages/` 下创建 Astro 页面即可，但不会自动获得导航入口与 widget 过滤能力——需要在 `LinkPresets` 登记。
