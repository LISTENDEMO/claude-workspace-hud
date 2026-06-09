# Claude Workspace HUD

一个 Claude Code 状态栏插件，显示当前工作区的会话和文件信息。

## 功能

- 📁 显示当前文件夹的文件统计（文件数量、目录数量、文件类型分布）
- 📝 显示当前会话信息和其他会话列表
- 🔄 支持快速切换会话（通过 `/switch-session` 命令）

## 显示效果

**默认布局（2行）**：
```
📁 my-project | 15 文件, 3 目录 | .ts(8) .json(3) .md(2)
📝 当前: fix-auth-bug (25m) | 其他会话: debug-api, setup-env, test-flow
```

## 安装

### 方法 1：通过市场安装（推荐）

```bash
# 步骤 1：添加市场
/plugin marketplace add anthropics/claude-code

# 步骤 2：安装插件
/plugin install claude-workspace-hud

# 步骤 3：重新加载插件
/reload-plugins

# 步骤 4：配置状态栏
/claude-workspace-hud:setup
```

### 方法 2：本地安装

```bash
# 克隆或复制插件到 Claude 插件目录
cd "G:\claude code\.claude\plug"
npm install
npm run build

# 在 Claude Code 中运行
/plugin install ./G:\claude code\.claude\plug
/claude-workspace-hud:setup
```

## 配置

随时自定义您的 HUD：

```bash
/claude-workspace-hud:configure
```

### 配置选项

| 选项 | 说明 |
|------|------|
| `language` | HUD 标签语言：`en` (英文) 或 `zh` (中文) |
| `showFileStats` | 显示文件统计信息 |
| `showSessionList` | 显示其他会话列表 |
| `showExtensions` | 显示文件类型分布 |
| `maxSessions` | 显示的最大会话数量 |
| `maxExtensions` | 显示的最大文件类型数量 |

## 快速切换会话

使用 `/switch-session` 命令查看并切换到其他会话：

```bash
/claude-workspace-hud:switch-session
```

## 运行环境要求

- Claude Code v1.0.80+
- Node.js 18+ 或 Bun

## 开发

```bash
npm install
npm run build
npm test
```

## 许可证

MIT