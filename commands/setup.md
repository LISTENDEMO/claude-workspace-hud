---
description: Setup claude-workspace-hud as your statusline
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

**Note**: Placeholders like `{RUNTIME_PATH}`, `{SOURCE}`, and `{GENERATED_COMMAND}` should be substituted with actual detected values.

## Step 0: Detect Platform, Shell, and Runtime

**IMPORTANT**: Use the environment context values (`Platform:` and `Shell:`) as your starting point. On `win32`, also check `$OSTYPE` via the Bash tool.

**On `win32`, run this check first:**
```bash
echo $OSTYPE
```

| Platform | Shell | OSTYPE | Command Format |
|----------|-------|--------|----------------|
| `darwin` | any | any | bash (macOS instructions) |
| `linux` | any | any | bash (Linux instructions) |
| `win32` | `bash` | any | bash — Windows + Git Bash instructions |
| `win32` | `powershell`, `pwsh`, or `cmd` | `msys` or `cygwin` | bash — Windows + Git Bash instructions |
| `win32` | `powershell`, `pwsh`, or `cmd` | other / empty | PowerShell — Windows + PowerShell instructions |

---

**macOS/Linux** (Platform: `darwin` or `linux`):

1. Get plugin path:
   ```bash
   ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-workspace-hud/*/ 2>/dev/null | awk -F/ '{ print $(NF-1) "\t" $(0) }' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+[[:space:]]' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-
   ```
   If empty, the plugin is not installed. Ask the user to install via `/plugin install claude-workspace-hud` first.

2. Get runtime absolute path:
   - On `darwin` or `linux`, prefer bun for performance and fall back to node:
     ```bash
     command -v bun 2>/dev/null || command -v node 2>/dev/null
     ```
   - On `win32` + `bash`, require node:
     ```bash
     command -v node 2>/dev/null
     ```

   If empty, stop setup and explain that the current shell cannot find the required runtime.

3. Verify the runtime exists:
   ```bash
   ls -la {RUNTIME_PATH}
   ```

4. Determine source file based on runtime:
   - On `darwin` or `linux`, use `src/index.ts` when the runtime is bun. Otherwise use `dist/index.js`.
   - On Windows, always use `dist/index.js`.

5. Generate command:

   **When runtime is bun**:
   ```
   bash -c 'cols=$(stty size </dev/tty 2>/dev/null | awk '"'"'{print $2}'"'"'); export COLUMNS=$(( ${cols:-120} > 4 ? ${cols:-120} - 4 : 1 )); plugin_dir=$(ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-workspace-hud/*/ 2>/dev/null | awk -F/ '"'"'{ print $(NF-1) "\t" $(0) }'"'"' | grep -E '"'"'^[0-9]+\.[0-9]+\.[0-9]+[[:space:]]'"'"' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-); exec "{RUNTIME_PATH}" --env-file /dev/null "${plugin_dir}{SOURCE}"'
   ```

   **When runtime is node**:
   ```
   bash -c 'cols=$(stty size </dev/tty 2>/dev/null | awk '"'"'{print $2}'"'"'); export COLUMNS=$(( ${cols:-120} > 4 ? ${cols:-120} - 4 : 1 )); plugin_dir=$(ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-workspace-hud/*/ 2>/dev/null | awk -F/ '"'"'{ print $(NF-1) "\t" $(0) }'"'"' | grep -E '"'"'^[0-9]+\.[0-9]+\.[0-9]+[[:space:]]'"'"' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-); exec "{RUNTIME_PATH}" "${plugin_dir}{SOURCE}"'
   ```

**Windows + Git Bash** (Platform: `win32`, Shell: `bash`):

On Windows require `node` and always use `dist/index.js`.

   ```
   cols=$(stty size </dev/tty 2>/dev/null | awk '{print $2}'); export COLUMNS=$(( ${cols:-120} > 4 ? ${cols:-120} - 4 : 1 )); plugin_dir=$(ls -1d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-workspace-hud/*/ 2>/dev/null | sort -V | tail -1); exec "{RUNTIME_PATH}" "${plugin_dir}{SOURCE}"
   ```

**Windows + PowerShell** (Platform: `win32`, Shell: `powershell`, `pwsh`, or `cmd`, OSTYPE: other/empty):

1. Get plugin path:
   ```powershell
   $claudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
   (Get-ChildItem (Join-Path $claudeDir "plugins\cache\*\claude-workspace-hud\*") -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d+(\.\d+)+$' } | Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1).FullName
   ```

2. Get runtime absolute path (require node on Windows):
   ```powershell
   if (Get-Command node -ErrorAction SilentlyContinue) { (Get-Command node).Source } else { Write-Error "Node.js not found" }
   ```

3. Use `dist\index.js`.

4. Write the PowerShell wrapper script:

   ```powershell
   $wrapperDir = Join-Path $claudeDir "plugins\claude-workspace-hud"
   New-Item -ItemType Directory -Force -Path $wrapperDir | Out-Null
   $wrapperPath = Join-Path $wrapperDir "statusline.ps1"
   $runtimePathLiteral = $runtimePath.Replace("'", "''")
   $wrapperBody = ({
       try { $w = [Console]::WindowWidth } catch { $w = 120 }
       $env:COLUMNS = [Math]::Max(1, $w - 4)
       $claudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME '.claude' }
       $pluginDir = (Get-ChildItem (Join-Path $claudeDir 'plugins\cache\*\claude-workspace-hud\*') -Directory -ErrorAction SilentlyContinue |
           Where-Object { $_.Name -match '^\d+(\.\d+)+$' } |
           Sort-Object { [version]$_.Name } -Descending |
           Select-Object -First 1).FullName
       if (-not $pluginDir) { exit 0 }
       & '__RUNTIME_PATH__' (Join-Path $pluginDir 'dist\index.js')
   }.ToString().Trim()).Replace('__RUNTIME_PATH__', $runtimePathLiteral)
   [System.IO.File]::WriteAllText($wrapperPath, $wrapperBody, (New-Object System.Text.UTF8Encoding $false))
   ```

5. Generate command:

   ```
   powershell -NoProfile -ExecutionPolicy Bypass -File "{WRAPPER_PATH}"
   ```

## Step 2: Test Command

Run the generated command. It should produce output within a few seconds.

## Step 3: Apply Configuration

Read the settings file and merge in the statusLine config, preserving all existing settings:

```json
{
  "statusLine": {
    "type": "command",
    "command": "{GENERATED_COMMAND}"
  }
}
```

After successfully writing the config, tell the user:

> ✅ Config written. **Please restart Claude Code now** — quit and run `claude` again in your terminal.

## Step 4: Verify & Finish

Use AskUserQuestion:
- Question: "Setup complete! The workspace HUD should appear below your input field. Is it working?"
- Options: "Yes, it's working" / "No, something's wrong"

**If no**: Debug systematically following the same patterns as claude-hud setup verification.