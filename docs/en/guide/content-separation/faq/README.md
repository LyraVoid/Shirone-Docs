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

**Symptom**: Cloudflare Pages, Vercel, or other hosts fail to clone the content repo during builds. Two error messages are common:

```text
fatal: Authentication failed for 'https://github.com/...'
```

```text
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

**Cause**: the content repo is private while `CONTENT_REPO_URL` lacks an access token, or the token expired or lacks read access to the content repo. The second message typically appears on build machines such as EdgeOne Pages: Git cannot prompt for credentials in a non-interactive environment and fails immediately.

**Fix**:

1. Create a personal access token with `Contents: Read` access on the content repo;
2. Update the platform dashboard environment variable to include the token:

   ```text
   https://x-access-token:<TOKEN>@github.com/OWNER/CONTENT_REPO.git
   ```

3. Trigger a rebuild on the platform.

Public content repositories do not require access tokens. If the content repository is public, ensure the URL does not use SSH formatting (build containers usually have no SSH keys configured).

## 3. Host build fails: 403 Write access to repository not granted

**Symptom**: the platform build fails while fetching the content repo:

```text
remote: Write access to repository not granted.
fatal: unable to access 'https://github.com/OWNER/CONTENT_REPO.git/': The requested URL returned error: 403
```

**Cause**: the message is misleading — the problem is not missing write access. Usually the fine-grained PAT's **Repository access** does not include the **content repo** (for example, the theme repo was selected by mistake, or the token only covers public repositories), or the **Contents** permission was never set. A fine-grained token's repository scope and permissions cannot be edited after creation; it must be regenerated.

**Fix**:

1. Generate a new token: scope **Repository access** to the **content repo** only, with `Contents: Read`;
2. Verify locally first. Listing refs (or no output on an empty repo, without errors) means the token works:

   ```bash
   git ls-remote https://x-access-token:<TOKEN>@github.com/OWNER/CONTENT_REPO.git
   ```

3. Update the token inside the platform's `CONTENT_REPO_URL` variable and rebuild.

See [Access Tokens](/en/guide/content-separation/pat/) for detailed steps.

## 4. Host build fails: couldn't find remote ref main

**Symptom**: the platform build fails while fetching the content repo:

```text
fatal: couldn't find remote ref main
```

**Cause**: the content repo has no commits yet (the remote repository is empty, so the target branch does not exist), or `CONTENT_REPO_REF` points to a non-existent branch.

**Fix**:

1. Confirm the content repo has been pushed at least once and the build branch exists remotely;
2. Verify that `CONTENT_REPO_REF` matches the actual branch name (default `main`).

## 5. YAML changed but the page did not

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

## 6. A new post is missing from the list

Check the following in order:

1. `draft: true`: draft posts are excluded from production builds;
2. `published` contains a future date: unpublished posts are hidden by default;
3. File extension is neither `.md` nor `.mdx`;
4. File is not placed directly under `content/posts/`, or the filename contains unescaped whitespace;
5. Run `npx astro check` in the theme repo to detect missing required frontmatter properties.

## 7. A deleted post is still reachable

**Cause**: stale files remain in local build caches or the hosting platform's build cache.

**Fix**:

```bash
pnpm content:clean          # preview cleanup plan
pnpm content:clean --yes    # apply cleanup; backed up to .content-backup/
pnpm content:sync           # re-sync content
```

If this occurs on a hosting platform, clear its build cache and redeploy.

## 8. How to write image and file paths

- Standard image assets: use relative paths such as `./image.png`, or site-root absolute paths such as `/images/...`;
- Relative path layouts in the content repo match the theme repo and preserve relative hierarchy after syncing;
- `@[code-tree]` and `<!-- @include: ... -->` read the filesystem directly, so their paths must be relative to the theme repo root.

Other standard Markdown syntax is unaffected by content separation.

## 9. Build succeeds but deployment fails

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
