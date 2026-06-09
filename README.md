# Claude Workspace HUD

一个 Claude Code 状态栏插件，显示 Git 状态、GitHub 连接状态，支持一键推送和版本管理。

## 功能

### 🌿 Git 状态显示
- 当前分支名称
- 未提交更改指示器 `*`
- 待推送/待拉取数量 `↑N ↓N`
- 文件更改统计 `+N ~N ?N`（暂存/未暂存/未跟踪）

### 🐙 GitHub 连接状态
- 登录状态检测（是否已登录 GitHub CLI）
- 仓库连接状态（是否有远程仓库）
- 仓库名称显示（`owner/repo` 格式）
- 同步状态（`已同步` 或 `待推送 N`）

### 🚀 快捷命令
- `/push-github` - **一键推送 + 自动版本管理**
  - 自动递增版本号（如 `0.1.0 → 0.1.1`）
  - 创建 Git 提交
  - 推送到 GitHub
  - 自动创建版本标签
- `/browse-files` - 查看完整文件树结构
- `/switch-session` - 切换到其他会话

## 显示效果

```
[glm-5] │ my-project                   ← 模型/项目名
上下文 ████░░░░░░ 44%                   ← 上下文使用率
🌿 main │ ↑2 │ +3 ~1 ?2                 ← Git 状态
🐙 已连接 LISTENDEMO/my-project 已同步   ← GitHub 状态
```

## 安装

### 方法 1：本地安装

```bash
# 克隆仓库
git clone https://github.com/LISTENDEMO/claude-workspace-hud.git

# 安装依赖并构建
cd claude-workspace-hud
npm install
npm run build

# 复制到插件目录
cp -r . ~/.claude/plugins/cache/local/claude-workspace-hud/0.1.0/

# 在 Claude Code 中重新加载
/reload-plugins
```

### 方法 2：配置状态栏

编辑 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/plugins/claude-workspace-hud/statusline-simple.sh"
  }
}
```

## GitHub 登录

使用前需登录 GitHub CLI：

```bash
gh auth login
```

登录后状态会永久保存（使用系统密钥库）。

## 配置选项

编辑 `~/.claude/plugins/claude-workspace-hud/config.json`：

```json
{
  "language": "zh",
  "display": {
    "showGitStatus": true,
    "showGitHub": true,
    "showDepsInfo": false,
    "showTips": false
  }
}
```

| 选项 | 说明 |
|------|------|
| `showGitStatus` | 显示 Git 分支和更改状态 |
| `showGitHub` | 显示 GitHub 连接和同步状态 |
| `showDepsInfo` | 显示 package.json 依赖数量 |
| `showTips` | 显示快捷命令提示 |

## 版本管理

每次使用 `/push-github` 命令时会自动：
1. 递增 `package.json` 版本号
2. 创建提交 `v0.1.X: update from Claude Code`
3. 推送到 GitHub
4. 创建 Git 标签 `v0.1.X`

## 运行环境要求

- Claude Code v1.0.80+
- Node.js 18+ 或 Bun
- GitHub CLI (`gh`) - 用于 GitHub 状态检测和推送

## 开发

```bash
npm install
npm run build
```

## 许可证

MIT