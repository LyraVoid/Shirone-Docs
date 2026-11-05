---
title: 常见问题
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/faq/
---

根据报错现象查找解决方案。每条问题先说明可能原因，再提供排查与修复步骤。

## 1. 派发报错：403 Resource not accessible by integration

**现象**：内容仓的 `trigger-build.yml` 工作流在执行派发步骤时中断报错。

```text
HttpError: Resource not accessible by integration
```

**原因**：`DISPATCH_TOKEN` 未被授予主题仓的写权限，或生成令牌时选错了仓库。

**处理**：

1. 打开 GitHub 令牌设置页面，确认 **Repository access** 选中的是**主题仓**；
2. 确认 **Contents** 权限已设为 **Read and write**；
3. 重新生成令牌，并更新内容仓中的 `DISPATCH_TOKEN` 密钥。

详细申请流程见[申请个人访问令牌](/guide/content-separation/pat/)。

## 2. 平台构建报错：Authentication failed

**现象**：Cloudflare Pages、Vercel 等托管平台在构建阶段拉取内容仓失败，常见报错有两种：

```text
fatal: Authentication failed for 'https://github.com/...'
```

```text
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

**原因**：内容仓为私有仓库，而 `CONTENT_REPO_URL` 缺少访问令牌，或令牌已过期、未授予内容仓读取权限。第二种报错常见于 EdgeOne Pages 等构建机：Git 在无终端交互的环境下无法弹出账号提示，直接失败。

**处理**：

1. 创建一个具备内容仓 `Contents: Read` 权限的个人访问令牌；
2. 将平台控制台中的环境变量更新为携带令牌的 HTTPS 格式：

   ```text
   https://x-access-token:<TOKEN>@github.com/用户名/内容仓名.git
   ```

3. 重新触发平台构建。

公开内容仓无需附带令牌。若内容仓为公开属性，请检查仓库地址是否误写成了 SSH 格式（平台构建机通常未预设对应私钥）。

## 3. 平台构建报错：403 Write access to repository not granted

**现象**：平台构建拉取内容仓时失败：

```text
remote: Write access to repository not granted.
fatal: unable to access 'https://github.com/用户名/内容仓名.git/': The requested URL returned error: 403
```

**原因**：报错文案有误导性，问题并不在「写权限」。通常是细粒度令牌（Fine-grained PAT）的 **Repository access** 未勾选**内容仓**（例如误选了主题仓，或仅选择了公开仓库范围），或 **Contents** 权限未设置。细粒度令牌的仓库范围与权限在创建后不可修改，只能重新生成。

**处理**：

1. 重新生成令牌：Repository access 仅勾选**内容仓**，权限设置为 `Contents: Read`；
2. 本地先行验证，能列出引用（或空仓库时无输出但不报错）即通过：

   ```bash
   git ls-remote https://x-access-token:<TOKEN>@github.com/用户名/内容仓名.git
   ```

3. 更新平台环境变量 `CONTENT_REPO_URL` 中的令牌，重新构建。

详细申请流程见[申请个人访问令牌](/guide/content-separation/pat/)。

## 4. 平台构建报错：couldn't find remote ref main

**现象**：平台构建拉取内容仓时失败：

```text
fatal: couldn't find remote ref main
```

**原因**：内容仓尚未推送任何提交（远程仓库为空，目标分支不存在），或 `CONTENT_REPO_REF` 指向了不存在的分支。

**处理**：

1. 确认内容仓已完成首次推送，远程存在构建分支；
2. 核对 `CONTENT_REPO_REF` 与内容仓实际分支名一致（默认 `main`）。

## 5. 改了 YAML 但页面没有变化

**现象**：修改了 `config/site.yaml` 或其他配置文件后，本地预览或线上站点均未呈现预期变更。

**处理**：

::: steps

1. **检查字段拼写**

   ```bash
   pnpm content:validate
   ```

   终端会明确指出报错的配置字段与建议的修正写法。

2. **检查数组配置格式**

   `nav-bar.yaml` 与 `sidebar.yaml` 中的列表字段遵循整体替换规则，仅书写新增项无法生效，必须声明完整列表。具体规则详见[配置覆盖](/guide/content-separation/config-overlay/#对象合并与数组替换)。

3. **核对文件存放位置**

   配置文件必须放置在内容仓的 `config/` 目录下，且文件名须与文档规范严格保持一致。放置在其他路径下的文件将被直接忽略。

4. **确认当前生效的内容源**

   ```bash
   pnpm content:status
   ```

   若输出显示为 `local`，说明系统仍在使用主题仓自带内容。请核查 `CONTENT_DIR` 或 `CONTENT_REPO_URL` 环境变量是否已正确配置并生效。

:::

## 6. 新文章没有出现在列表里

按以下顺序依次排查：

1. `draft: true`：草稿文章默认不会打包进生产构建产物；
2. `published` 设置为未来时间：系统默认不展示未到发布时限的文章；
3. 文件后缀名不是 `.md` 或 `.mdx`；
4. 文章文件未存放在 `content/posts/` 目录下，或者文件名中包含未转义空格；
5. 在主题仓中执行 `npx astro check`，排查是否存在必填 frontmatter 属性缺失。

## 7. 删掉的文章仍然能访问

**原因**：本地构建产物或托管平台的构建缓存中残留了旧文件。

**处理**：

```bash
pnpm content:clean          # 预演清理计划
pnpm content:clean --yes    # 正式清理，自动备份至 .content-backup/
pnpm content:sync           # 重新执行同步
```

托管平台出现同类问题时，清理平台构建缓存后重新部署即可。

## 8. 图片和文件路径怎么写

- 普通图片资源：使用相对路径 `./image.png`，或以网站根目录为基准的绝对路径 `/images/...`；
- 内容仓内的相对路径规范与主题仓一致，在同步物化后会保持相对位置关系；
- `@[code-tree]` 与 `<!-- @include: ... -->` 会直接访问文件系统，其路径需以主题仓根目录为基准填写。

其余标准 Markdown 语法不受内容分离影响。

## 9. 构建成功，但平台部署报错

**现象**：主题仓 Actions 构建正常，托管平台的部署日志却报错：

```text
Error: Command "pnpm build" exited with 1
```

**原因**：Actions 上传的是已经编译完成的静态 `dist/` 产物，其中不包含 `package.json`，但托管平台依然保留着预设的构建命令并尝试重复构建。

**处理**：将托管平台项目切换为纯静态托管模式：

- Framework Preset 更改为 `Other`；
- 清空 Build Command 与 Output Directory；
- 关闭 Git 自动构建触发器。

不同平台的菜单名称略有不同，详见[部署总览](/guide/deploy/overview/)与对应平台说明页。仅断开 Git 关联可能不够，构建命令通常保存在项目核心配置中，需单独手动清空。

## 其他问题

- 检查内容仓目录结构是否符合规范：执行 `pnpm content:validate`；
- 部署平台选型对比：参阅[部署总览](/guide/deploy/overview/)；
- 本地调试异常排查：参阅[本地预览与调试](/guide/content-separation/local-preview/)。
