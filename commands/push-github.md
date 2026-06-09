---
description: Push current changes to GitHub with auto version bump
allowed-tools: Bash, Read, Edit
---

# Push to GitHub (with Version Management)

Push all current changes to GitHub and automatically bump the version number.

## Step 1: Get Current Version

Read the current version from package.json:

```bash
cat "${cwd}/package.json" | grep '"version"' | head -1
```

## Step 2: Bump Version

Parse current version and increment patch number:
- If current is `0.1.0`, new version is `0.1.1`
- If current is `0.1.5`, new version is `0.1.6`

Update package.json with new version using Edit tool.

## Step 3: Check Git Status

Check what changes exist:

```bash
cd "${cwd}" && git status --short
```

## Step 4: Commit with Version

Create a commit with the new version:

```bash
cd "${cwd}" && git add . && git commit -m "v${new_version}: update from Claude Code"
```

## Step 5: Push to GitHub

Push to remote:

```bash
cd "${cwd}" && git push origin master
```

## Step 6: Create Git Tag (Optional)

Create a version tag:

```bash
cd "${cwd}" && git tag v${new_version} && git push origin v${new_version}
```

## Step 7: Report Result

After pushing, report:
- "✅ 已推送到 GitHub (v${new_version})"
- "📦 版本已更新: ${old_version} → ${new_version}"