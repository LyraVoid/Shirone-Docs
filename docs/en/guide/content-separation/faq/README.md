---
title: Troubleshooting
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/faq/
---

Identify the observed symptom, review potential root causes, and follow the remediation steps.

## 1. Dispatch fails: 403 Resource not accessible by integration

**Symptom**: the dispatch step in the content repo's `trigger-build.yml` workflow fails.

```text
HttpError: Resource not accessible by integration
```

**Cause**: `DISPATCH_TOKEN` lacks write permissions on the theme repo, or was scoped to the wrong repository.

**Fix**:

1. Open token settings in GitHub, confirm **Repository access** selects your **theme repo**;
2. Confirm **Contents** permission is configured to **Read and write**;
3. Generate a new token and update the `DISPATCH_TOKEN` secret in the content repo.

See [Access Tokens](/en/guide/content-separation/pat/) for detailed steps.

## 2. Host build fails: Authentication failed

**Symptom**: Cloudflare Pages, Vercel, or other hosts fail to clone the content repo during builds.

```text
fatal: Authentication failed for 'https://github.com/...'
```

**Cause**: `CONTENT_REPO_URL` lacks an access token, or the token expired or lacks read access to the content repo.

**Fix**:

1. Create a personal access token with `Contents: Read` access on the content repo;
2. Update the platform dashboard environment variable to include the token:

   ```text
   https://x-access-token:<TOKEN>@github.com/OWNER/CONTENT_REPO.git
   ```

3. Trigger a rebuild on the platform.

Public content repositories do not require access tokens. If the content repository is public, ensure the URL does not use SSH formatting (build containers usually have no SSH keys configured).

## 3. YAML changed but the page did not

**Symptom**: edits to `config/site.yaml` or other configuration files do not appear locally or in production.

**Fix**:

::: steps

1. **Check field spelling**

   ```bash
   pnpm content:validate
   ```

   The terminal specifies invalid keys and provides suggestions.

2. **Check array syntax**

   List fields in `nav-bar.yaml` and `sidebar.yaml` follow full replacement rules; declaring only newly added entries will not merge. See [Configuration Overlay](/en/guide/content-separation/config-overlay/#object-merge-vs-array-replace).

3. **Check file location**

   Configuration files must reside in `config/` inside the content repo, with file names matching documented conventions. Files placed elsewhere are ignored.

4. **Verify active content source**

   ```bash
   pnpm content:status
   ```

   If the output displays `local`, the theme is reading bundled default content. Verify that `CONTENT_DIR` or `CONTENT_REPO_URL` variables are configured and active.

:::

## 4. A new post is missing from the list

Check the following in order:

1. `draft: true`: draft posts are excluded from production builds;
2. `published` contains a future date: unpublished posts are hidden by default;
3. File extension is neither `.md` nor `.mdx`;
4. File is not placed directly under `content/posts/`, or the filename contains unescaped whitespace;
5. Run `npx astro check` in the theme repo to detect missing required frontmatter properties.

## 5. A deleted post is still reachable

**Cause**: stale files remain in local build caches or the hosting platform's build cache.

**Fix**:

```bash
pnpm content:clean          # preview cleanup plan
pnpm content:clean --yes    # apply cleanup; backed up to .content-backup/
pnpm content:sync           # re-sync content
```

If this occurs on a hosting platform, clear its build cache and redeploy.

## 6. How to write image and file paths

- Standard image assets: use relative paths such as `./image.png`, or site-root absolute paths such as `/images/...`;
- Relative path layouts in the content repo match the theme repo and preserve relative hierarchy after syncing;
- `@[code-tree]` and `<!-- @include: ... -->` read the filesystem directly, so their paths must be relative to the theme repo root.

Other standard Markdown syntax is unaffected by content separation.

## 7. Build succeeds but deployment fails

**Symptom**: the theme repo's Actions build succeeds, but the host's deployment log reports:

```text
Error: Command "pnpm build" exited with 1
```

**Cause**: GitHub Actions uploaded pre-built static `dist/` files containing no `package.json`, but the host still ran its pre-configured build command.

**Fix**: configure the host as pure static hosting:

- Set Framework Preset to `Other`;
- Clear Build Command and Output Directory fields;
- Disconnect automatic Git build triggers.

Menu labels vary across platforms; consult [Deployment Overview](/en/guide/deploy/overview/) and specific platform guides. Disconnecting Git alone is often insufficient, as build commands persist in project settings and must be cleared explicitly.

## Other questions

- Validating content repo structure: run `pnpm content:validate`;
- Choosing a deployment platform: see [Deployment Overview](/en/guide/deploy/overview/);
- Debugging local preview issues: see [Local Preview & Debugging](/en/guide/content-separation/local-preview/).
