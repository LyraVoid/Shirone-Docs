---
title: 申请个人访问令牌
createTime: 2026/11/04 10:00:00
permalink: /guide/content-separation/pat/
---

双仓模式最多会使用到两个 GitHub 个人访问令牌（PAT）。两个令牌的方向相反，不可混用。

| 令牌名称 | 所需权限 | 配置仓库 | 核心用途 |
| --- | --- | --- | --- |
| `DISPATCH_TOKEN` | 主题仓 `Contents: Read and write` | **内容仓** | 通知主题仓启动自动构建 |
| `CONTENT_REPO_TOKEN` | 内容仓 `Contents: Read` | **主题仓** | 供主题仓检出私有内容 |

若仅使用部署钩子触发托管平台自身构建、不使用主题仓 Actions 构建，只需配置平台钩子密钥，无需使用 `DISPATCH_TOKEN`，详见[部署钩子](/guide/content-separation/deploy-hooks/)。

## 申请步骤

以下以申请 `DISPATCH_TOKEN`（对主题仓拥有写权限的令牌）为例。若申请 `CONTENT_REPO_TOKEN`，请在第 5 步改选内容仓，并在第 6 步将权限设定为 `Contents: Read`。

::: steps

1. **打开个人设置**

   点击 GitHub 右上角个人头像，选择 **Settings**。

   ![GitHub 个人菜单中的 Settings 入口](/images/content-separation/04-deploy/01-dispatch/01-settings-click.png)

2. **进入开发者设置**

   在左侧导航栏滑到底部，点击 **Developer settings**。

   ![左侧底部 Developer settings 入口](/images/content-separation/04-deploy/01-dispatch/02-developer-settings.png)

   ![Developer settings 页面](/images/content-separation/04-deploy/01-dispatch/03-developer-settings-menu.png)

3. **选择细粒度令牌**

   展开 **Personal access tokens**，点击 **Fine-grained tokens**。

   ![Fine-grained tokens 选项](/images/content-separation/04-deploy/01-dispatch/04-fine-grained-tokens.png)

4. **新建令牌**

   点击页面右上角的 **Generate new token**。

   ![生成新令牌按钮](/images/content-separation/04-deploy/01-dispatch/05-generate-new-token.png)

5. **填写名称并选择仓库**

   - **Token name**：填写 `DISPATCH_TOKEN`，便于后续对照识别；
   - **Expiration**：按需设置有效时长，建议设为 90 天。过期后需重新生成并更新仓库 Secret；
   - **Repository access**：勾选 **Only select repositories**，下拉选中**主题仓**。

   ![指定生效的主题仓](/images/content-separation/04-deploy/01-dispatch/06-repository-access.png)

   派发事件是向主题仓发送的，因此此处必须选中主题仓，切勿选错为内容仓。

6. **配置 Contents 权限**

   展开 **Permissions** -> **Repository permissions**，定位到 **Contents** 权限项，修改为 **Read and write**。

   ![赋予 Contents 读写权限](/images/content-separation/04-deploy/01-dispatch/07-contents-permission.png)

7. **生成并保存令牌**

   点击页面底部的 **Generate token**，立即复制生成的令牌字符串。

   ![创建成功并复制令牌](/images/content-separation/04-deploy/01-dispatch/08-generate-pat-token.png)

   GitHub 仅在此处展示一次令牌明文，离开页面后将无法再次查看。建议先保存至密码管理器，再继续后续配置。

:::

## 配置到仓库

申请到的令牌字符串需保存到 GitHub 仓库的 Actions 密钥中：

1. 打开目标仓库，进入 **Settings** -> **Secrets and variables** -> **Actions**；
2. 点击右上角的 **New repository secret** 按钮；

![进入仓库设置并新建 Actions 密钥](/images/content-separation/04-deploy/01-dispatch/09-repository-secrets.png)

3. **Name** 填写 `DISPATCH_TOKEN` 或 `CONTENT_REPO_TOKEN`，**Secret** 粘贴刚才复制的令牌字符串；
4. 点击 **Add secret** 保存。

详细配置位置与全流程说明请参阅[跨仓自动构建](/guide/content-separation/ci-dispatch/)。

## 注意事项

- 令牌权限应严格遵循最小权限原则：`DISPATCH_TOKEN` 仅授权主题仓，`CONTENT_REPO_TOKEN` 仅授权内容仓。
- 主题仓与内容仓均为公开仓库时，可直接省略 `CONTENT_REPO_TOKEN`。
- 切勿将令牌提交至 `.env`、工作流文件或 README 中。包含令牌的 URL 仅能配置在平台环境变量或 GitHub Secret 中。
- 令牌过期或权限变更后，需重新生成并更新仓库 Secret，随后手动触发一次构建以验证有效性。
