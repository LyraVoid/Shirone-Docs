---
title: 设备页
createTime: 2026/09/01 00:27:00
permalink: /guide/pages/devices/
---

设备页（`/devices/`）展示你的设备清单与桌面/随身装备。行为由 `devicesConfig.ts` 控制，条目数据在 `src/data/devices.ts` 维护。

## 行为配置

```ts title="src/config/devicesConfig.ts"
export const devicesConfig = withUserConfig("devices", {
  enable: true,        // 总开关：false 时导航入口隐藏，访问 /devices/ 跳转 404
  categories: [        // 场景分类，数组顺序 = 页面顶部 Chips 顺序
    {
      key: "desk",
      label: "Desk Setup",
      icon: "material-symbols:desktop-windows-outline-rounded",
      description: "Workstation & home office hardware",
    },
    {
      key: "mobile",
      label: "Mobile & EDC",
      icon: "material-symbols:phone-iphone",
      description: "Daily portable devices & smart gadgets",
    },
    {
      key: "audio",
      label: "Audio & Visual",
      icon: "material-symbols:headphones-rounded",
      description: "Headphones, speakers & monitoring gears",
    },
    {
      key: "peripheral",
      label: "Peripherals",
      icon: "material-symbols:keyboard-outline-rounded",
      description: "Keyboards, mice & desk accessories",
    },
  ],
  // disabledIds: [], // 可选：被禁用的设备 ID 列表
})
```

| 字段 | 说明 |
| --- | --- |
| `enable` | 页面总开关 |
| `categories` | 场景分类清单，比其他页面多一个 `description` 字段（Chips 下的弱文本说明） |
| `disabledIds` | 按设备 `id` 停用单个条目 |

## 数据字段

```ts title="src/data/devices.ts"
export const devicesData: DeviceItem[] = [
  {
    id: "macbook-pro-16",                // 唯一标识（禁用列表按它命中）
    name: 'MacBook Pro 16"',             // 设备名称
    brand: "Apple",                      // 品牌
    category: "desk",                    // 场景分类，引用 config 中的 key
    status: "active",                    // 状态（如 active 在用）
    specs: "M3 Max / 64GB / 2TB",        // 规格参数
    description: "主力开发工作站……",      // 使用感受说明
    icon: "material-symbols:laptop-mac-rounded",
    featured: true,                      // 精选展示
    year: "2024",                        // 购入/发布年份
    link: "https://www.apple.com/…",     // 商品/官网链接（可选）
  },
]
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 唯一标识，`disabledIds` 按它命中 |
| `name` / `brand` | 是 | 设备名与品牌 |
| `category` | 是 | 引用 config 分类 key |
| `status` | 是 | 使用状态（如 `active`） |
| `specs` | 否 | 规格参数一句话 |
| `description` | 否 | 使用感受 |
| `icon` / `featured` / `year` / `link` | 否 | 图标、精选、年份、链接 |

## 实战示例

**新增一台设备**

```ts title="src/data/devices.ts"
{
  id: "keychron-q1",
  name: "Keychron Q1",
  brand: "Keychron",
  category: "peripheral",
  status: "active",
  specs: "QMK / Gasket / 75%",
  description: "手感扎实的客制化键盘，日常写码主力。",
  icon: "material-symbols:keyboard-outline-rounded",
  year: "2025",
}
```

**淘汰设备但保留记录**

```ts title="src/config/devicesConfig.ts"
disabledIds: ["old-monitor"],
```

**新增「外设配件」分类**

```ts title="src/config/devicesConfig.ts"
categories: [
  // …既有分类,
  {
    key: "accessory",
    label: "Accessories",
    icon: "material-symbols:cable-rounded",
    description: "Cables, docks & desk mats",
  },
]
```

## 常见问题

::: collapse
- 设备不显示

  三层检查：页面 `enable` → `category` 是否引用了 `categories` 中已有的 key → `id` 是否被 `disabledIds` 命中。

- categories 的 description 有什么用

  显示在分类 Chips 下方作为分组说明——这是设备页独有的字段（其他展示页的分类没有）。

- status 有哪些取值

  数据源以 `active` 表示在用。你可以扩展自定义值（如 `retired` 退役、`planning` 计划中），页面会原样展示；保持简短英文即可。
:::
