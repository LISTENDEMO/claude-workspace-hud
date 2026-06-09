import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
export const DEFAULT_CONFIG = {
    language: 'zh',
    display: {
        showGitStatus: true,
        showGitHub: true,
        showDepsInfo: true,
        showTips: true,
        showTasks: true,
        showAgents: true,
    },
    colors: {
        folder: 'yellow',
        git: 'green',
        github: 'magenta',
        deps: 'cyan',
        tip: 'dim',
        label: 'dim',
        task: 'brightBlue',
        agent: 'brightMagenta',
    },
};
let pluginDir = null;
function getPluginDir() {
    if (pluginDir) {
        return pluginDir;
    }
    const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
    pluginDir = path.join(claudeDir, 'plugins', 'claude-workspace-hud');
    return pluginDir;
}
export function loadConfig() {
    const configPath = path.join(getPluginDir(), 'config.json');
    try {
        const content = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(content);
        // Merge with defaults
        return {
            ...DEFAULT_CONFIG,
            ...parsed,
            display: {
                ...DEFAULT_CONFIG.display,
                ...parsed.display,
            },
            colors: {
                ...DEFAULT_CONFIG.colors,
                ...parsed.colors,
            },
        };
    }
    catch {
        // Return defaults if config doesn't exist or is invalid
        return DEFAULT_CONFIG;
    }
}
//# sourceMappingURL=config.js.map