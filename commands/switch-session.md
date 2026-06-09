---
description: Switch to another session in the current project
allowed-tools: Bash, Read, AskUserQuestion
---

# Switch Session

This command helps you quickly switch to another session in the current project.

## Step 1: Get Project Sessions

Scan the project session directory to find available sessions:

**macOS/Linux**:
```bash
project_slug=$(echo "${PWD}" | sed 's/[\/\\]/-/g' | sed 's/^[-]+//' | sed 's/[-]+$//')
session_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects/${project_slug}"
ls -lht "$session_dir"/*.jsonl 2>/dev/null | head -10
```

**Windows + PowerShell**:
```powershell
$projectSlug = $PWD -replace '[\\/]', '-' -replace '^[-]+', '' -replace '[-]+$', ''
$claudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$sessionDir = Join-Path $claudeDir "projects\$projectSlug"
Get-ChildItem "$sessionDir\*.jsonl" | Sort-Object LastWriteTime -Descending | Select-Object -First 10
```

Extract session IDs from the file names (UUIDs).

## Step 2: Display Session List

Show the available sessions with:
- Session ID (shortened for readability)
- Creation time
- Last modified time
- File size (indicating activity level)

## Step 3: Ask User to Select

Use AskUserQuestion:
- header: "Select Session"
- question: "Which session would you like to switch to?"
- multiSelect: false
- options: List of sessions with their timestamps

## Step 4: Provide Resume Command

After user selection, tell them:

> To switch to this session, use the `/resume` command with the session ID:
> ```
> /resume <session-id>
> ```

Or provide instructions on how to resume directly in Claude Code.