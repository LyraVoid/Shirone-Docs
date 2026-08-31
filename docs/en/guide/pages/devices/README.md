---
title: Devices
createTime: 2026/09/01 00:27:00
permalink: /en/guide/pages/devices/
---

The devices page (`/devices/`) presents your gear list—desk setups and everyday carry. Behavior is controlled by `devicesConfig.ts`; entries live in `src/data/devices.ts`.

## Behavior Config

```ts title="src/config/devicesConfig.ts"
export const devicesConfig = withUserConfig("devices", {
  enable: true,        // master switch: false hides nav, /devices/ returns 404
  categories: [        // scene categories; array order = chips order on the page
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
  // disabledIds: [], // optional: disabled device IDs
})
```

| Field | Description |
| --- | --- |
| `enable` | Page master switch |
| `categories` | Scene categories—one extra `description` field compared to other pages (muted text under the chips) |
| `disabledIds` | Disable a single entry by device `id` |

## Data Fields

```ts title="src/data/devices.ts"
export const devicesData: DeviceItem[] = [
  {
    id: "macbook-pro-16",                // unique id (disable list matches on it)
    name: 'MacBook Pro 16"',             // device name
    brand: "Apple",                      // brand
    category: "desk",                    // scene category, references a config key
    status: "active",                    // status (e.g. active)
    specs: "M3 Max / 64GB / 2TB",        // spec line
    description: "Primary workstation…", // usage notes
    icon: "material-symbols:laptop-mac-rounded",
    featured: true,                      // featured display
    year: "2024",                        // purchase/release year
    link: "https://www.apple.com/…",     // product/official link (optional)
  },
]
```

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Unique identifier; `disabledIds` matches on it |
| `name` / `brand` | Yes | Device name and brand |
| `category` | Yes | References a config category key |
| `status` | Yes | Usage status (e.g. `active`) |
| `specs` | No | One-line spec summary |
| `description` | No | Usage notes |
| `icon` / `featured` / `year` / `link` | No | Icon, featured, year, link |

## Practical Examples

**Adding a device**

```ts title="src/data/devices.ts"
{
  id: "keychron-q1",
  name: "Keychron Q1",
  brand: "Keychron",
  category: "peripheral",
  status: "active",
  specs: "QMK / Gasket / 75%",
  description: "A solid custom keyboard—my daily driver for coding.",
  icon: "material-symbols:keyboard-outline-rounded",
  year: "2025",
}
```

**Retiring a device but keeping the record**

```ts title="src/config/devicesConfig.ts"
disabledIds: ["old-monitor"],
```

**Adding an Accessories category**

```ts title="src/config/devicesConfig.ts"
categories: [
  // …existing categories,
  {
    key: "accessory",
    label: "Accessories",
    icon: "material-symbols:cable-rounded",
    description: "Cables, docks & desk mats",
  },
]
```

## FAQ

::: collapse
- A device doesn't show

  Check three layers: page `enable` → does `category` reference an existing key in `categories` → is the `id` hit by `disabledIds`.

- What is categories' description for

  It shows under the category chips as group notes—a field unique to the devices page (other showcase pages' categories don't have it).

- What values does status take

  The data source uses `active` for in-use gear. You can extend with custom values (like `retired` or `planning`)—the page displays them as-is; keep them short.
:::
