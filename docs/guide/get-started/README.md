---
title: 快速开始
permalink: /guide/get-started/
createTime: 2026/08/31 20:54:26
---

# 快速开始

本文介绍如何在本地运行与构建本站。

## 环境要求

- Node.js：`^20.19.0 || >=22.0.0`
- 包管理器：pnpm（`packageManager` 指定为 `pnpm@11.17.0`）

## 安装依赖

```sh
pnpm install
```

## 本地开发

```sh
pnpm docs:dev
```

启动后访问终端输出的本地地址（默认 `http://localhost:8080/`）。如遇缓存问题，可使用 `pnpm docs:dev-clean` 清理缓存后启动。

## 构建与预览

```sh
# 构建生产静态文件
pnpm docs:build

# 本地预览构建产物
pnpm docs:preview
```

## 目录结构

```
docs/
├── .vuepress/        # 站点配置、主题定制、静态资源
├── guide/            # 文档集合：指南
└── README.md         # 首页
```

::: collapse 常用脚本一览

| 脚本 | 说明 |
| --- | --- |
| `pnpm docs:dev` | 启动开发服务器 |
| `pnpm docs:dev-clean` | 清理缓存后启动开发服务器 |
| `pnpm docs:build` | 构建生产静态文件 |
| `pnpm docs:preview` | 本地预览构建产物 |
| `pnpm vp-update` | 更新 VuePress 与主题 |

:::
