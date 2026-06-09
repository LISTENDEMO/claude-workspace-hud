# Claude Workspace HUD

A Claude Code statusline plugin that displays Git status, GitHub connection status, and supports one-click push with version management.

## Features

### 🌿 Git Status Display
- Current branch name
- Uncommitted changes indicator `*`
- Push/pull counts `↑N ↓N`
- File change statistics `+N ~N ?N` (staged/unstaged/untracked)

### 🐙 GitHub Connection Status
- Login status detection (GitHub CLI authentication)
- Repository connection status (remote existence)
- Repository name display (`owner/repo` format)
- Sync status (`synced` or `pending N`)

### 📋 Task Progress Display
- Current task name (auto-truncated for long names)
- Task completion progress `completed/total`
- Completion percentage (color changes by progress: red <50%, yellow 50-80%, green >80%)
- Visual progress bar `██████░░░░`

### 🤖 Agent Status Display
- Running agents count
- Background agents count
- Total agents count

### 🚀 Quick Commands
- `/push-github` - **One-click push + auto version management**
  - Auto-increment version number (e.g., `0.1.0 → 0.1.1`)
  - Create Git commit
  - Push to GitHub
  - Auto-create version tag
- `/browse-files` - View complete file tree structure
- `/switch-session` - Switch to another session

## Display Example

```
[glm-5] │ my-project                   ← Model/Project name
Context █████░░░░░ 44%                  ← Context usage
🌿 main │ ↑2 │ +3 ~1 ?2                 ← Git status
🐙 Connected LISTENDEMO/my-project synced ← GitHub status
📦 5 deps, 2 dev                       ← Dependencies
📋 Implementing feature 3/5 60% ██████░░░░ ← Task progress
🤖 Running 2 Background 1 (3)           ← Agent status
💡 /push-github Push to GitHub | ...    ← Quick tips
```

## Installation

### Method 1: Local Install

```bash
# Clone repository
git clone https://github.com/LISTENDEMO/claude-workspace-hud.git

# Install dependencies and build
cd claude-workspace-hud
npm install
npm run build

# Copy to plugin directory
cp -r . ~/.claude/plugins/cache/local/claude-workspace-hud/0.1.0/

# Reload in Claude Code
/reload-plugins
```

### Method 2: Configure Statusline

Edit `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/plugins/claude-workspace-hud/statusline-simple.sh"
  }
}
```

## GitHub Login

Login to GitHub CLI before using:

```bash
gh auth login
```

The login status is permanently saved (using system keychain).

## Configuration Options

Edit `~/.claude/plugins/claude-workspace-hud/config.json`:

```json
{
  "language": "en",
  "display": {
    "showGitStatus": true,
    "showGitHub": true,
    "showDepsInfo": true,
    "showTips": true,
    "showTasks": true,
    "showAgents": true
  },
  "colors": {
    "folder": "yellow",
    "git": "green",
    "github": "magenta",
    "deps": "cyan",
    "tip": "dim",
    "label": "dim",
    "task": "brightBlue",
    "agent": "brightMagenta"
  }
}
```

| Option | Description |
|--------|-------------|
| `showGitStatus` | Display Git branch and change status |
| `showGitHub` | Display GitHub connection and sync status |
| `showDepsInfo` | Display package.json dependency count |
| `showTips` | Display quick command tips |
| `showTasks` | Display task progress and completion rate |
| `showAgents` | Display Agent running status |

## Version Management

Each time using `/push-github` command:
1. Increment `package.json` version number
2. Create commit `v0.1.X: update from Claude Code`
3. Push to GitHub
4. Create Git tag `v0.1.X`

## Requirements

- Claude Code v1.0.80+
- Node.js 18+ or Bun
- GitHub CLI (`gh`) - for GitHub status detection and push

## Development

```bash
npm install
npm run build
```

## License

MIT