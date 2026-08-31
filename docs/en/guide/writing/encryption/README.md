---
title: Post Encryption
createTime: 2026/08/31 23:15:00
permalink: /en/guide/writing/encryption/
---

Shirone supports post-level password protection: the body is encrypted into the static HTML at build time (zero plaintext output), and readers decrypt it locally in the browser after entering the password. Ideal for private diaries or paid-content teasers.

## Quick Start

Just add a password to the frontmatter:

```yaml title="src/content/posts/private-diary.md"
---
title: Private Diary
published: 2026-08-26
tags: [Diary]
encrypted: true
password: "my-secret-password"
passwordHint: "Hint: my birthday"
hideHomeContent: true
---
```

Field reference:

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `encrypted` | `boolean` | No | `false` | Explicitly marks the post as encrypted. Implicitly `true` if `password` is set. |
| `password` | `string` | Yes | None | The plaintext password used to encrypt at build time and unlock at runtime. |
| `passwordHint` | `string` | No | `""` | Optional hint displayed under the password input. |
| `hideHomeContent` | `boolean` | No | `true` | Hides the summary and word count on index/archive cards and RSS. |

## Security Architecture

The encryption system shares a unified security foundation with protected albums:

1. **Zero plaintext in static builds**: during the Astro SSG pipeline, the post body is compiled to HTML and immediately encrypted with AES-256-GCM before pages are emitted—the published static HTML contains no plaintext of the body or outline
2. **Authenticated encryption + scope binding**: key derivation follows OWASP recommendations (310,000 PBKDF2 iterations, SHA-256, cryptographically random 16-byte salt); every payload gets an independent 12-byte random IV; Additional Authenticated Data (AAD) binds `shirone-protected-content:1:post:${slug}`—ciphertexts cannot be replayed across posts
3. **Session persistence, zero disk storage of passwords**: decrypted content is cached in ephemeral browser session storage (30-minute expiration); plaintext passwords are never written to disk; the decrypted state persists across Swup navigations and page reloads
4. **Full-site leak prevention**:
   - Search indexing (Pagefind) and search engines never see plaintext
   - RSS feeds emit localized placeholders
   - With `hideHomeContent: true`, descriptions and word counts are masked on index and archive cards
   - The table of contents stays hidden until unlock and is rebuilt dynamically on decryption

## Experience After Unlocking

Decryption coordinates with runtime helpers to dynamically mount syntax highlighting, code collapse, interactive Mermaid diagrams, LaTeX formulas, and image lightboxes—encrypted posts have exactly the same enhancement capabilities as regular ones.

## Applicable Boundaries

::: warning Security Scope
Static client-side encryption is designed to prevent unauthorized browsing and automated indexing. For mission-critical commercial secrets, server-side authentication is recommended.

Also note: **static encryption has no centralized server database—if a password is forgotten, the content cannot be recovered.** Store your passwords safely.
:::

## Practical Examples

**Private essay (with hint)**

```yaml
---
title: An Essay for Friends Only
published: 2026-08-26
password: "our-shared-secret"
passwordHint: "The café we always went to"
---
```

`encrypted` can be omitted—setting `password` implicitly enables encryption.

**Paid-content teaser**

```yaml
---
title: Deep Tutorial (Full Version)
published: 2026-08-26
encrypted: true
password: "subscribed-only"
passwordHint: "Subscribers receive the password by email"
hideHomeContent: false
---
```

`hideHomeContent: false` keeps the summary visible—readers see the introduction while the body stays locked, working as a subscription hook.

## FAQ

**Correct password but it won't unlock**

Check for stray spaces (quoting YAML strings is recommended); if you changed the password after building, you must rebuild—the ciphertext is generated at build time, so editing frontmatter alone has no effect.

**What if I forget the password**

There is no recovery. Static encryption has no server-side database. Rebuild from the original Markdown source (the unencrypted source still exists as plaintext in `src/content/posts/`) to reset it.

**Can encrypted posts be found by search**

The body cannot. Pagefind and search engines only get the encrypted placeholder; metadata like the title and tags remains public (it powers list display)—keep sensitive information out of titles.

**Does encryption affect performance**

Not for regular readers—decryption happens only after a password is entered, and within a 30-minute session it is not repeated. Non-encrypted posts never touch the encryption code path.
