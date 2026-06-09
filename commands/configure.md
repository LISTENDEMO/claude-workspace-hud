---
description: Configure workspace HUD display options
allowed-tools: Read, Write, AskUserQuestion
---

# Configure Claude Workspace HUD

**FIRST**: Use the Read tool to load `~/.claude/plugins/claude-workspace-hud/config.json` if it exists.

Store current values and note whether config exists.

## Configuration Options

### Q1: Language
- header: "Language"
- question: "Choose your HUD label language:"
- multiSelect: false
- options:
  - "English (Recommended)" - Default, English labels
  - "中文" - Show HUD labels in Chinese

### Q2: File Stats Display
- header: "File Stats"
- question: "Show file statistics in the HUD?"
- multiSelect: false
- options:
  - "Show stats (Recommended)" - Display file count, directory count, extension distribution
  - "Hide stats" - Don't show file statistics

### Q3: Session List Display
- header: "Session List"
- question: "Show other sessions in the HUD?"
- multiSelect: false
- options:
  - "Show list (Recommended)" - Display other session names
  - "Hide list" - Only show current session info

### Q4: Max Items
- header: "Max Items"
- question: "How many items to show?"
- multiSelect: false
- options:
  - "5 (Recommended)" - Show up to 5 sessions/extensions
  - "3" - Show up to 3 items (more compact)
  - "10" - Show up to 10 items (more detailed)

---

## Config Keys

| Selection | Config keys |
|-----------|------------|
| Language | `language: "en"` or `language: "zh"` |
| File Stats | `display.showFileStats: true/false` |
| Session List | `display.showSessionList: true/false` |
| Max Items | `display.maxSessions: N`, `display.maxExtensions: N` |

---

## Before Writing - Validate & Preview

**Show preview before saving:**

1. **Summary of changes:**
```
Language: 中文
File Stats: Show
Session List: Show
Max Items: 5
```

2. **Preview of HUD:**
```
📁 my-project | 15 文件, 3 目录 | .ts(8) .json(3) .md(2)
📝 当前: fix-auth-bug (25m) | 其他会话: debug-api, setup-env, test-flow
```

3. **Confirm**: "Save these changes?"

---

## Write Configuration

Write to `~/.claude/plugins/claude-workspace-hud/config.json`.

Merge with existing config.

---

## After Writing

Say: "Configuration saved! The HUD will reflect your changes immediately."