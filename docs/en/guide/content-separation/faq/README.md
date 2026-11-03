---
title: Troubleshooting & FAQ
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/faq/
---

This document aggregates common diagnostic solutions, permission fixes, and configuration troubleshooting for the dual-repo content separation setup.

---

## 1. CI Build Error: 403 Resource not accessible by integration <Badge text="Permissions" type="danger" />

### Symptom
When pushing commits to the content repository, `trigger-build.yml` fails:
```text title="GitHub Actions Error"
HttpError: Resource not accessible by integration
```

### Cause
The `DISPATCH_TOKEN` configured in your content repository lacks write permissions to dispatch events to the theme repository.

### Solution
::: steps
1. **Go to GitHub Personal Access Token Settings**

   Go to **Settings** -> **Developer Settings** -> **Personal access tokens**.

2. **Verify Fine-Grained Token Permissions**

   - **Repository access**: Ensure the ==Theme Code Repository== is selected;
   - **Permissions**: Verify **Contents** permission is set to ==Read and write=={.error}.

3. **Update Repository Secret**

   Save the new token into the content repository's `DISPATCH_TOKEN` Secret.
:::

For the complete step-by-step pictorial guide on PAT generation and permissions, see [Create a GitHub Personal Access Token (PAT)](/en/guide/content-separation/ci-dispatch/#step-1-create-a-github-personal-access-token-pat).

---

## 2. Cloud Platform Authentication Failed <Badge text="Auth Error" type="danger" />

### Symptom
Cloudflare Pages or Vercel build log outputs:
```text title="Build Log Error"
fatal: Authentication failed for 'https://github.com/...'
```

### Cause
The `CONTENT_REPO_URL` environment variable on your hosting platform is missing a valid Personal Access Token or the token has expired.

### Solution
1. Generate a token with read access to your content repository;
2. Update `CONTENT_REPO_URL` on your hosting dashboard:
   ```text title="CONTENT_REPO_URL"
   https://x-access-token:YOUR_TOKEN@github.com/YOUR_USERNAME/my-blog-content.git
   ```
3. Trigger a fresh deployment.

See [Content Sources and Environment Variables](/en/guide/content-separation/content-sources/) for all variables, and [Create a GitHub Personal Access Token (PAT)](/en/guide/content-separation/ci-dispatch/#step-1-create-a-github-personal-access-token-pat) for the step-by-step pictorial guide.

---

## 3. Modified YAML Configurations Not Taking Effect <Badge text="Config Check" type="warning" />

### Symptom
Attributes modified in `config/site.yaml` or other YAML files do not update on the rendered page.

### Diagnostic Steps
::: steps
1. **Run Validation Command**

   ```bash title="content:validate"
   pnpm content:validate
   ```

   Check for typo suggestions (e.g. `titel` instead of `title`).

2. **Check Merge Strategy**

   If modifying array lists (like `nav-bar.yaml` or `sidebar.yaml` components), remember arrays follow ==atomic full replacement=={.error}. You must provide the complete list of items.

3. **Verify File Names and Directory**

   Ensure files reside inside `config/` and filenames match domain names strictly (`site.yaml`, `profile.yaml`).
:::

---

## 4. Local Posts Not Rendering After Build <Badge text="Content Filter" type="info" />

### Symptom
A newly drafted post inside `content/posts/` does not appear in the homepage post list.

### Checklist
::: details Expand to View 4 Essential Verification Points
1. **Check Draft Flag**: Is `draft: true`? Draft posts are automatically excluded from production builds;
2. **Check Publish Date**: Is `published` set to a future date? Future posts are hidden by default;
3. **Check File Extension**: Is the file extension `.md` or `.mdx`?
4. **Run Type Check**: Run `npx astro check` in the theme repo to detect missing schema fields.
:::

---

## 5. Local Cache Glitches or Phantom Data <Badge text="Cache Clean" type="tip" />

### Symptom
Deleted posts still linger in local preview due to outdated caches.

### Solution
Perform a safe reset and cache purge:

```bash title="Safe Reset"
# 1. Preview clean plan
pnpm content:clean

# 2. Execute clean reset
pnpm content:clean --yes

# 3. Re-sync content
pnpm content:sync
```

---

## 6. Special Markdown Extension Paths

Keep these two path rules in mind:
- **Standard Media**: Use relative paths `./image.png` or root paths `/images/...`; the sync engine preserves mount mappings;
- **Direct Filesystem Directives**: `@[code-tree]` and `<!-- @include: ... -->` read the physical filesystem directly and require paths relative to the theme repository root. All other 15 Markdown syntax extensions are completely unaffected.

---

## 7. Actions Build Succeeds, but Vercel Fails with `Command "pnpm build" exited with 1` <Badge text="Build Config" type="danger" />

### Symptom
In the theme repo Actions workflow, `pnpm build` succeeds completely, and the final step `vercel deploy dist --prod` uploads successfully. However, in the Vercel dashboard deployment logs, the build errors out and terminates:

```text title="Vercel Build Log"
Skipping build cache since Package Manager changed from "pnpm" to "npm"
Running "vercel build"
Error: Command "pnpm build" exited with 1
```

### Cause
You are using the "Actions builds and uploads `dist/` static artifacts" mode, but the Vercel project still retains the build settings from when it was originally linked to Git (Framework Preset set to `Astro`, Build Command set to `pnpm build`).

The `dist/` uploaded by Actions contains pure static files without a `package.json`. When Vercel cloud tries to invoke `pnpm build` again, it inevitably fails because no build scripts exist. Note: **Simply disconnecting the Git integration is not enough**, because the Build Command is stored independently in project settings.

### Solution
::: steps
1. **Switch Project to Pure Static Hosting**

   Log in to Vercel, open your project, and navigate to **Settings** -> **Build & Output Settings**:
   - Change **Framework Preset** to `Other`;
   - Toggle OFF the Override switch for **Build Command** (clearing the command);
   - Toggle OFF the Override switch for **Output Directory** (clearing the directory).

2. **Disconnect Git Auto-Builds**

   Go to **Settings** -> **Git** and disconnect the repository (or disable automatic deployments) to prevent Actions direct uploads and Git auto-builds from conflicting and overwriting each other.

3. **Re-trigger Deployment Verification**

   Return to the theme repo Actions and run `deploy.yml` again. Verify in the Vercel deployment log that `Running "vercel build"` no longer appears, confirming that configuration is active.
:::

For differences between both deployment methods, refer to [Deployment Overview](/en/guide/deploy/overview/) and [Deploy to Vercel](/en/guide/deploy/vercel/).
