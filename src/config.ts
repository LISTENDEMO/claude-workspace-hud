import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import type { Language } from './types.js';

export interface WorkspaceConfig {
  cwd?: string;
  language: Language;
  display: {
    showGitStatus: boolean;
    showGitHub: boolean;
    showDepsInfo: boolean;
    showTips: boolean;
    showTasks: boolean;
    showAgents: boolean;
  };
  colors: {
    folder: string;
    git: string;
    github: string;
    deps: string;
    tip: string;
    label: string;
    task: string;
    agent: string;
  };
}

export const DEFAULT_CONFIG: WorkspaceConfig = {
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

let pluginDir: string | null = null;

function getPluginDir(): string {
  if (pluginDir) {
    return pluginDir;
  }

  const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  pluginDir = path.join(claudeDir, 'plugins', 'claude-workspace-hud');
  return pluginDir;
}

export function loadConfig(): WorkspaceConfig {
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
  } catch {
    // Return defaults if config doesn't exist or is invalid
    return DEFAULT_CONFIG;
  }
}