---
title: Troubleshooting & FAQ
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/faq/
---

# Troubleshooting & FAQ

This document addresses common questions and troubleshooting steps for the decoupled content separation architecture.

---

## 1. CI Build Error: 403 Resource not accessible by integration

### Symptom
Content repo `trigger-build.yml` fails with:
```text
HttpError: Resource not accessible by integration
```

### Solution
1. In GitHub, go to **Settings** -> **Developer Settings** -> **Personal access tokens**;
2. Verify token properties:
   - **Repository access**: Ensure the **theme code repository** is selected;
   - **Permissions**: Set **Contents** permission to **Read and write**;
3. Update the token in your content repo's `DISPATCH_TOKEN` Secret.

---

## 2. Authentication failed when cloning private content repo

### Symptom
Deployment logs report:
```text
fatal: Authentication failed for 'https://github.com/...'
```

### Solution
Ensure `CONTENT_REPO_URL` on your hosting platform contains a valid access token:
```text
https://x-access-token:YOUR_TOKEN@github.com/USER/CONTENT_REPO.git
```

---

## 3. YAML changes are not taking effect

### Diagnosis
1. **Run Validation**:
   ```bash
   pnpm content:validate
   ```
   Check for property typos (e.g. `titel` instead of `title`);
2. **Check Merge Strategy**:
   Arrays (such as `nav-bar.yaml` or `sidebar.yaml` components) follow **whole replacement** rules. You must provide the full list of items;
3. **Verify File Location**:
   Ensure files are located under `config/` in the content repo with exact domain names (e.g., `site.yaml`, `profile.yaml`).

---

## 4. Newly written articles do not appear

1. **Check Draft Status**: Ensure `draft: false` in the frontmatter. Draft articles are filtered out in production builds;
2. **Check Publish Date**: Ensure `published` date is not set in the future;
3. **Run Typecheck**: In the theme repository, run `npx astro check` to verify metadata schema validity.

---

## 5. Local preview shows stale cache

Run a clean reset in the theme repository:

```bash
pnpm content:clean --yes
pnpm content:sync
```

---

## 6. Special Markdown Path Handling

- **Images and Local Assets**: Use standard relative paths `./image.png` or absolute paths from content root `/images/...`;
- **Filesystem Extensions**: `@[code-tree]` and `<!-- @include: ... -->` resolve paths relative to the theme code repository root. All other 15 Markdown syntax extensions work out of the box.
