---
title: 全局外壳与侧栏部件 (Shell & Sidebar Widgets)
createTime: 2026/09/01 02:00:00
permalink: /guide/api/components/shell-widgets/
---

全局外壳与侧栏部件构成了 Shirone 站点的持久化骨架，由主布局统一装配，在 Swup SPA 切页时保持常驻，提供无缝的连续播放、全局导航与主题切换体验。

---

## TopAppBar

**文件**：`src/components/organisms/TopAppBar.astro`  
**职责**：全局顶部导航应用栏，包含站点品牌 Logo、主导航链接组、全局搜索唤起按钮、深色模式切换与移动端汉堡抽屉触发器。

### 滚动响应契约

- **顶部初始态**：透明背景，与 BannerStage 自然融合。
- **页面向下滚动（> 60px）**：自动切换为带有半透明表面背景（`--surface-container`）、毛玻璃滤镜（`backdrop-filter: blur(12px)`）与 Level 2 阴影的吸顶状态。

---

## SideBar

**文件**：`src/components/organisms/SideBar.astro`  
**职责**：持久化侧边栏插槽容器，根据 `sidebarConfig.ts` 动态装配博主资料（Profile）、音乐播放器、分类/标签列表、公告栏与站点访问统计。

### 零额外负担原则

- 仅在配置中启用的部件才会输出 DOM。
- 禁用部件在构建期被完全 Tree-shaking 剔除，不消耗任何打包体积或请求资源。

---

## MusicSidebar & MusicSidebarClient

**文件**：`src/components/organisms/music/MusicSidebar.astro` & `MusicSidebarClient.svelte`  
**职责**：侧栏音乐播放器模块。外层 Astro 容器提供 SSR 静态占位骨架，内层 Svelte 客户端单例管理音频播放生命周期与 Meting 云端曲库拉取。

### 核心特性

- **跨页面连续播放**：由于挂载于 Swup 容器之外，站内跳转文章、瞬间或番剧页时**音乐绝不中断**。
- **混合容灾（`mixed`）**：首屏秒开本地曲目，后台异步扩容 Meting 歌单；断网自动静默回退。
- **状态响应**：响应系统媒体控制键（Media Session API），支持锁屏显示封面与曲目信息。

---

## UmamiStats & UmamiRuntime

**文件**：`src/components/organisms/UmamiStats.astro` & `src/components/system/UmamiRuntime.astro`  
**职责**：
- `UmamiStats.astro`：渲染公开访问统计展示槽位（`profile` 模式或文章 `meta` 模式）。
- `UmamiRuntime.astro`：注入全局单例请求池，拦截 Swup 路由切换事件并自动向 Umami 刷新数据。

---

## DisplaySettings & LightDarkSwitch

**文件**：`src/components/organisms/DisplaySettings.svelte` & `LightDarkSwitch.svelte`  
**职责**：
- `DisplaySettings`：提供动态色相调节盘（HCT 种子色选择）、壁纸模糊度滑块与排版字号调节。
- `LightDarkSwitch`：太阳/月亮图标平滑过渡的明暗主题快速切换按钮。

---

## ContextMenu

**文件**：`src/components/organisms/ContextMenu.svelte`  
**职责**：右键增强菜单，接管浏览器默认右键菜单，提供快速复制、分享、返回顶部、跳转随机文章与夜间模式切换。

---

## RouteProgress

**文件**：`src/components/organisms/RouteProgress.svelte`  
**职责**：页面顶部加载进度条，深度绑定 Swup 生命周期，在页面跳转时展现 Material 3 强调减速动效。
