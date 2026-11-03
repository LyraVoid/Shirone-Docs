---
title: 常见问题与排错
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/faq/
---

本文汇总了在双仓内容分离架构下常见的错误现象、原因分析与解决方案。

---

## 1. 跨仓构建报错：403 Resource not accessible by integration <Badge text="权限问题" type="danger" />

### 现象
内容仓推送新提交后，`trigger-build.yml` 工作流报错：
```text title="GitHub Actions Error"
HttpError: Resource not accessible by integration
```

### 原因分析
内容仓配置的 `DISPATCH_TOKEN` 权限不足，未能获得对主题代码仓的写权限。

### 解决方案
::: steps
1. **前往个人访问令牌设置**

   登录 GitHub 前往 **Settings** -> **Developer Settings** -> **Personal access tokens**。

2. **检查细粒度令牌权限**

   - **Repository access**：确认已选中 ==主题代码仓库==；
   - **Permissions**：确认已将 **Contents** 权限设为 ==Read and write=={.error}。

3. **更新仓库 Secret**

   将重新生成的令牌值更新到内容仓的 `DISPATCH_TOKEN` Secret 中。
:::

完整的 PAT 申请与权限配置图文流程见[申请 GitHub 个人访问令牌（PAT）](/guide/content-separation/ci-dispatch/#第一步-申请-github-个人访问令牌-pat)。

---

## 2. 托管平台拉取私有内容仓失败：Authentication failed <Badge text="鉴权失败" type="danger" />

### 现象
在 Cloudflare Pages 或 Vercel 构建时，日志提示克隆私有内容仓失败：
```text title="Build Log Error"
fatal: Authentication failed for 'https://github.com/...'
```

### 原因分析
托管平台上的 `CONTENT_REPO_URL` 环境变量未携带有效的访问令牌，或令牌已过期。

### 解决方案
1. 生成一个具备内容仓读取权限的个人访问令牌；
2. 在托管平台的环境变量中将 `CONTENT_REPO_URL` 修改为带令牌的格式：
   ```text title="CONTENT_REPO_URL"
   https://x-access-token:你的访问令牌@github.com/用户名/内容仓名.git
   ```
3. 重新触发一次部署构建。

完整的变量说明见[内容源配置与环境变量](/guide/content-separation/content-sources/)，PAT 图文申请流程见[申请 GitHub 个人访问令牌（PAT）](/guide/content-separation/ci-dispatch/#第一步-申请-github-个人访问令牌-pat)。

---

## 3. 修改了 YAML 配置但页面没有生效 <Badge text="配置诊断" type="warning" />

### 现象
在内容仓的 `config/site.yaml` 或其他配置文件中修改了属性，但在本地预览或构建后未看到变化。

### 诊断步骤
::: steps
1. **运行安全预检命令**

   ```bash title="content:validate"
   pnpm content:validate
   ```

   查看是否有字段拼写错误提示（例如将 `title` 误写为 `titel`）。

2. **检查合并策略**

   若修改的是数组列表（如 `nav-bar.yaml` 或 `sidebar.yaml` 中的 `components`），请注意数组遵循 ==整体替换规则=={.error}，必须列出完整的条目列表，而不能只写增量项。

3. **检查文件名与目录**

   确认配置文件保存在内容仓的 `config/` 目录下，且文件名与领域名称严格匹配（如 `site.yaml`、`profile.yaml`）。
:::

---

## 4. 本地撰写的文章在构建后未显示 <Badge text="内容过滤" type="info" />

### 现象
在 `content/posts/` 编写了新文章，但在首页文章列表中没有出现。

### 排查清单
::: details 展开查看 4 项核心排查条件
1. **检查草稿状态**：文章元数据中的 `draft` 字段是否为 `true`。草稿文章在生产打包时会被自动过滤；
2. **检查发布日期**：`published` 日期是否被设置为了未来的时间。系统默认不显示未到发布日期的文章；
3. **检查文件扩展名**：文章文件扩展名是否为 `.md` 或 `.mdx`；
4. **运行类型诊断**：在主题代码仓运行 `npx astro check`，排查是否有必填元数据缺失。
:::

---

## 5. 本地预览出现幽灵数据或缓存混乱 <Badge text="缓存清理" type="tip" />

### 现象
删除或移动了外部内容仓的某篇文章，但本地预览中仍然出现旧页面残留。

### 解决方案
在主题代码仓执行安全重置与缓存清理：

```bash title="Safe Reset"
# 1. 预演清理计划
pnpm content:clean

# 2. 确认无误后执行清理重置
pnpm content:clean --yes

# 3. 重新同步最新内容
pnpm content:sync
```

---

## 6. 特殊 Markdown 扩展语法的路径解析

在编写 Markdown 文章时，请注意以下两条路径规则：
- **普通图片与相对资源**：直接使用相对路径 `./image.png` 或相对于内容仓根目录的 `/images/...` 引用，同步工具会保持标准路径映射；
- **读取文件系统的特殊扩展**：`@[code-tree]` 与 `<!-- @include: ... -->` 会直接访问文件系统，其路径需填写相对于代码仓根目录的路径。其余 15 种 Markdown 自定义语法完全不受影响。

---

## 7. Actions 构建成功，Vercel 部署报错 `Command "pnpm build" exited with 1` <Badge text="构建配置" type="danger" />

### 现象
主题仓 Actions 工作流里 `pnpm build` 打包完全正常，最后一步 `vercel deploy dist --prod` 也顺利上传，但在 Vercel 控制台的部署日志里却报错中断：

```text title="Vercel Build Log"
Skipping build cache since Package Manager changed from "pnpm" to "npm"
Running "vercel build"
Error: Command "pnpm build" exited with 1
```

### 原因分析
当前采用的是「Actions 打包后上传 `dist/` 静态产物」的模式，但 Vercel 项目中依然保留着最初连接 Git 时的构建配置（Framework Preset 为 `Astro`，Build Command 为 `pnpm build`）。

Actions 上传的 `dist/` 是纯静态文件，里面根本没有 `package.json`，Vercel 云端再次调用 `pnpm build` 必然找不到脚本而报错。另外需要注意：**光断开 Git 关联并不能解决问题**，因为 Build Command 是独立保存在项目设置里的。

### 解决方案
::: steps
1. **将项目切为纯静态托管**

   登录 Vercel 进入项目，前往 **Settings** -> **Build & Output Settings**：
   - **Framework Preset** 改选为 `Other`；
   - **Build Command** 关闭 Override 开关（清空命令）；
   - **Output Directory** 关闭 Override 开关（清空目录）。

2. **断开 Git 自动构建**

   前往 **Settings** -> **Git** 断开仓库关联（或关闭自动触发），避免 Actions 直传与 Git 自动构建相互冲突覆盖。

3. **重新触发部署验证**

   回到主题仓 Actions 重新跑一次 `deploy.yml`。观察 Vercel 部署日志，不再出现 `Running "vercel build"` 即说明配置已正常生效。
:::

关于两种部署方式的区别，可以参考[部署总览](/guide/deploy/overview/)与[部署到 Vercel](/guide/deploy/vercel/)。
