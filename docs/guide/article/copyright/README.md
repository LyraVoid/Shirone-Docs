---
title: 版权声明
createTime: 2026/09/01 00:12:00
permalink: /guide/article/copyright/
---

文章页底部的 License 区块由 `licenseConfig.ts` 配置，展示文章的授权协议与链接。

## 配置

```ts title="src/config/licenseConfig.ts"
export const licenseConfig = withUserConfig("license", {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否显示版权区块 |
| `name` | `string` | `CC BY-NC-SA 4.0` | 协议名称，显示在文章页 License 区块 |
| `url` | `string` | CC 官方链接 | 协议全文地址，点击名称跳转 |

## 常见协议选择

| 协议 | 适用场景 |
| --- | --- |
| `CC BY-NC-SA 4.0` | 默认。署名-非商业性使用-相同方式共享：转载需署名、不得商用、衍生作品同协议 |
| `CC BY 4.0` | 署名即可自由使用（含商用），最宽松 |
| `CC BY-NC 4.0` | 署名 + 非商业 |
| `CC BY-NC-ND 4.0` | 最严格：署名 + 非商业 + 不得修改 |
| `All Rights Reserved` | 保留所有权利，未授权前禁止转载 |

修改示例（改为宽松的 CC BY 4.0）：

```ts title="src/config/licenseConfig.ts"
export const licenseConfig = withUserConfig("license", {
  enable: true,
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
})
```

## 与博主资料的配合

License 区块与 `profileConfig`（博主名）、文章发布/更新时间共同构成文章页的署名信息。关闭 License 区块不会影响页面其他部分。

::: tip 双仓覆盖
版权属于典型的站点级行为配置。双仓模式下可在内容仓 `config/license.yaml` 中覆盖，无需改动主题源码。

```yaml title="config/license.yaml（内容仓）"
enable: true
name: CC BY 4.0
url: https://creativecommons.org/licenses/by/4.0/
```
:::

## 常见问题

**想让每篇文章用不同协议怎么办**

`licenseConfig` 是全站级的。个别文章需要不同声明时，可在正文末尾手动补充说明文字，或在 `FooterConfig.html` 中附加说明。

**区块显示了但链接点不开**

检查 `url` 是否完整（含 `https://`）。协议名与链接建议保持一致，读者会通过链接核对条款。
