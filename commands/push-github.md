---
description: Push current changes to GitHub
allowed-tools: Bash
---

# Push to GitHub

Push all current changes to the GitHub remote repository.

## Step 1: Check Git Status

First check the current git status:

```bash
cd "${cwd}" && git status --short
```

## Step 2: Add and Commit

If there are changes, add and commit them:

```bash
cd "${cwd}" && git add . && git commit -m "Update: auto-commit from Claude Code"
```

## Step 3: Push to GitHub

Push to the remote:

```bash
cd "${cwd}" && git push
```

## Step 4: Report Result

After pushing, report the result:

- If successful: "✅ 已推送到 GitHub"
- If no changes: "✅ 无需推送，已是最新状态"
- If error: "❌ 推送失败: [error message]"