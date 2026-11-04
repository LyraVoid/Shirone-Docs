---
title: Access Tokens
createTime: 2026/11/04 10:00:00
permalink: /en/guide/content-separation/pat/
---

The dual-repo setup uses at most two GitHub personal access tokens (PATs). They operate in opposite directions and are not interchangeable.

| Token | Permission | Stored in | Purpose |
| --- | --- | --- | --- |
| `DISPATCH_TOKEN` | Theme repo `Contents: Read and write` | **Content repo** | Notify the theme repo to trigger automated builds |
| `CONTENT_REPO_TOKEN` | Content repo `Contents: Read` | **Theme repo** | Allow the theme repo to check out private content |

If you only use a platform Deploy Hook and never build using theme repo Actions, you only need the platform hook secret. See [Deployment Hooks](/en/guide/content-separation/deploy-hooks/).

## Create a token

The following instructions walk through creating `DISPATCH_TOKEN` (which requires write access to the theme repo). For `CONTENT_REPO_TOKEN`, select your content repo in Step 5, and set permissions to `Contents: Read` in Step 6.

::: steps

1. **Open personal settings**

   Click your GitHub avatar in the top right corner and choose **Settings**.

   ![Settings in the GitHub account menu](/images/content-separation/04-deploy/01-dispatch/01-settings-click.png)

2. **Open developer settings**

   Scroll to the bottom of the left sidebar and click **Developer settings**.

   ![Developer settings at the bottom of the sidebar](/images/content-separation/04-deploy/01-dispatch/02-developer-settings.png)

   ![Developer settings page](/images/content-separation/04-deploy/01-dispatch/03-developer-settings-menu.png)

3. **Choose fine-grained tokens**

   Expand **Personal access tokens** and select **Fine-grained tokens**.

   ![Fine-grained tokens entry](/images/content-separation/04-deploy/01-dispatch/04-fine-grained-tokens.png)

4. **Create new token**

   Click **Generate new token** in the top right.

   ![Generate new token button](/images/content-separation/04-deploy/01-dispatch/05-generate-new-token.png)

5. **Name token and select repository**

   - **Token name**: enter `DISPATCH_TOKEN` for straightforward tracking;
   - **Expiration**: select duration, recommended 90 days. When expired, generate a replacement and update the secret;
   - **Repository access**: choose **Only select repositories**, then select your **theme repo**.

   ![Selecting the theme repository](/images/content-separation/04-deploy/01-dispatch/06-repository-access.png)

   Because the dispatch event is delivered to the theme repo, you must choose the theme repo here rather than the content repo.

6. **Set Contents permission**

   Expand **Permissions** -> **Repository permissions**, find **Contents**, and set it to **Read and write**.

   ![Contents read and write permission](/images/content-separation/04-deploy/01-dispatch/07-contents-permission.png)

7. **Generate and copy token**

   Click **Generate token** and copy the resulting string immediately.

   ![Generated token](/images/content-separation/04-deploy/01-dispatch/08-generate-pat-token.png)

   GitHub displays the token string only once. Save it to a password manager before leaving the page.

:::

## Store it in the repository

Tokens must be saved in your GitHub repository Actions secrets rather than in project files:

1. Open the target repository, navigate to **Settings** -> **Secrets and variables** -> **Actions**;
2. Click the **New repository secret** button;

![Navigating to repository settings and creating an Actions secret](/images/content-separation/04-deploy/01-dispatch/09-repository-secrets.png)

3. Name it `DISPATCH_TOKEN` or `CONTENT_REPO_TOKEN`, and paste the token string;
4. Click **Add secret** to save.

Configuration details are covered in [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/).

## Notes

- Adhere to the principle of least privilege: `DISPATCH_TOKEN` requires access only to the theme repo; `CONTENT_REPO_TOKEN` requires access only to the content repo.
- When both theme and content repositories are public, `CONTENT_REPO_TOKEN` can be omitted.
- Never commit tokens to `.env`, workflow files, or READMEs. URLs containing tokens should only reside in platform environment variables or GitHub secrets.
- When tokens expire or permissions change, generate a new token, update the secret, and trigger a test build to verify.
