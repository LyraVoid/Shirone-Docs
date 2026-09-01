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
