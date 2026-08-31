---
title: 右键增强菜单
createTime: 2026/09/01 00:50:00
permalink: /guide/features/context-menu/
---

桌面端右键增强菜单：在浏览器原生右键菜单之外，提供复制选中文字、返回顶部、复制页面链接等快捷操作。由 `contextMenuConfig.ts` 配置。

## 配置

```ts title="src/config/contextMenuConfig.ts"
export const contextMenuConfig = withUserConfig("contextMenu", {
  enable: true,
  actions: ["copySelection", "backToTop", "sharePageLink"],
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 功能总开关（当前默认开启） |
| `actions` | `array` | 三项 | 操作清单，**数组顺序即菜单项顺序** |

## 可用操作

| action | 功能 |
| --- | --- |
| `copySelection` | 复制当前选中的文字 |
| `backToTop` | 平滑返回页面顶部 |
| `sharePageLink` | 复制当前页面链接 |

## 定制

**调整顺序**：直接重排 `actions` 数组。

**只留部分操作**：

```ts title="src/config/contextMenuConfig.ts"
{
  enable: true,
  actions: ["copySelection"],
}
```

**完全关闭**：

```ts title="src/config/contextMenuConfig.ts"
{
  enable: false,
  actions: ["copySelection", "backToTop", "sharePageLink"],
}
```

关闭后恢复浏览器原生右键菜单，且**零 DOM、零监听器、零客户端资源**——这是该功能的零额外负担契约。

## 适用范围

仅桌面端生效——移动端长按行为由浏览器与系统接管，不受此配置影响。

## 常见问题

::: collapse
- 右键菜单没变化
  检查 `enable` 是否被关闭；确认在桌面端浏览器中操作（触屏设备无效）。

- 想自定义菜单动作
  当前支持上述三种内置动作，暂不支持自定义动作项。有需求可到主题仓库提 Issue。
:::
