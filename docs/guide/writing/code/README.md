---
title: 代码展示
createTime: 2026/08/31 23:13:00
permalink: /guide/writing/code/
---

代码是技术文章的主角。Shirone 基于 Expressive Code 提供增强代码块（语法高亮、行装饰、折叠分段、行号），并提供两种文件树语法与多文件代码树，为多文件示例提供 IDE 式阅读体验。代码块明暗主题由 `expressiveCodeConfig.ts` 配置。

## 增强代码块（Expressive Code）

标准围栏代码块自动获得语法高亮、复制按钮、行号与明暗主题适配：

````
```typescript
import { decryptProtectedContent } from "@/utils/password-protection"

async function unlock(payload, password): Promise<string> {
    return decryptProtectedContent(payload, password, payload.scope)
}
```
````

Expressive Code 的行装饰（高亮行、diff 标记、文件名标题等）都可通过围栏元数据与行内标记使用，主题通过 `src/config/expressiveCodeConfig.ts` 切换。

## 文件树

### 嵌套列表语法（`:::file-tree`）

直接用 Markdown 嵌套列表书写目录结构：

````markdown
:::file-tree{title="Shirone 源码树"}
- src
  - components/
    - ++ Navigation.svelte # 新增组件
    - -- Button.astro # 移除组件
  - content
    - posts/
  - **content.config.ts** # 重要文件
- public/
- package.json
:::
````

标记规则：

- `++` / `--` 前缀：绿色新增 / 红色删除（diff 高亮）
- `#` 后的文字：右侧灰色行内注释
- `**粗体**`：重点文件强调
- 目录名后加 `/`（如 `components/`）：默认折叠，可点击展开（默认展开无需斜杠）

### 终端输出语法（```` ```file-tree ````）

把 `tree` 等命令的输出直接粘贴进 `file-tree` 围栏，Unicode 分支符（`├──`、`└──`、`│`）与 ASCII 分支自动解析：

````markdown
```file-tree title="构建产物" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```
````

选项：`title="标题"` 设置标题；`icon="colored" | "simple"` 切换彩色/单色文件图标（默认彩色）。

## 代码树（Code Trees）

左侧文件层级导航 + 右侧代码面板，适合多文件示例。

### 容器语法（`:::code-tree`）

多个围栏代码块放入 `:::code-tree`，每个代码块用 `title="路径"` 声明文件位置：

````markdown
:::code-tree{title="组件示例" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
```

```json title="package.json"
{
  "name": "button-demo"
}
```
:::
````

选项：

- `title="标题"`：头部标题
- `height="380px"`：桌面端高度（默认 `420px`，支持 `26rem` 等单位）
- `entry="路径"`：首次加载时激活的文件
- `icon="colored" | "simple"`：文件图标风格
- 任意代码块加 `:active` 标记可作为默认激活页签

### 目录自动导入（`@[code-tree]`）

直接指向本地目录，构建期自动扫描生成代码树，无需手工复制内容：

```markdown
@[code-tree title="站点配置" entry="siteConfig.ts"](/src/config)
```

## 选择建议

| 场景 | 推荐语法 |
| --- | --- |
| 单个代码片段 | 增强代码块 |
| 展示项目结构 | `:::file-tree` 或 `file-tree` 围栏 |
| 3 个以内文件的对照 | 多个代码块 + 文件名标题 |
| 多文件模块走读 | `:::code-tree` 或 `@[code-tree]` |

## 常见问题

**file-tree 里 `#` 开头的行变注释了吗**

`#` 只有写在**条目末尾**才渲染为注释（如 `- file.ts # 说明`）。目录名本身的 `#` 需避免。

**code-tree 高度不够看代码**

用 `height` 调整（如 `height="500px"`）。移动端自动切换为纵向布局，无需单独适配。

**`@[code-tree]` 报路径错误**

路径必须是仓库内目录（以 `/` 开头的仓库根相对路径）。目录不存在或含不支持文件类型时会保留原始标记。

**代码块主题跟站点明暗不同步**

检查 `expressiveCodeConfig.ts` 的主题配置；构建期会为明暗两套主题各生成一份样式。
