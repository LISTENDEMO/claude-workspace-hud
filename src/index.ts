import { readStdin } from './stdin.js';
import { getGitStatus, getDepsInfo, getGitHubStatus } from './files.js';
import { loadConfig } from './config.js';
import { render } from './render.js';
import { setLanguage, t } from './i18n/index.js';
import type { RenderContext, TaskInfo, AgentInfo } from './types.js';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';

function extractTaskInfo(stdin: RenderContext['stdin']): TaskInfo | null {
  if (!stdin.tasks) {
    return null;
  }

  const total = stdin.tasks.total ?? 0;
  const completed = stdin.tasks.completed ?? 0;
  const inProgress = stdin.tasks.in_progress ?? 0;
  const pending = stdin.tasks.pending ?? 0;
  const currentTask = stdin.tasks.current_task ?? null;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    currentTask,
    completionRate,
  };
}

function extractAgentInfo(stdin: RenderContext['stdin']): AgentInfo | null {
  if (!stdin.agents) {
    return null;
  }

  return {
    total: stdin.agents.total ?? 0,
    running: stdin.agents.running ?? 0,
    background: stdin.agents.background ?? 0,
  };
}

export type MainDeps = {
  readStdin: typeof readStdin;
  getGitStatus: typeof getGitStatus;
  getDepsInfo: typeof getDepsInfo;
  getGitHubStatus: typeof getGitHubStatus;
  loadConfig: typeof loadConfig;
  render: typeof render;
  log: (...args: unknown[]) => void;
};

export async function main(overrides: Partial<MainDeps> = {}): Promise<void> {
  const deps: MainDeps = {
    readStdin,
    getGitStatus,
    getDepsInfo,
    getGitHubStatus,
    loadConfig,
    render,
    log: console.log,
    ...overrides,
  };

  try {
    const stdin = await deps.readStdin();

    if (!stdin) {
      // Running without stdin - this happens during setup verification
      const config = deps.loadConfig();
      setLanguage(config.language);
      deps.log(t('initializing'));
      return;
    }

    const cwd = stdin.cwd || stdin.workspace?.current_dir || process.cwd();

    // Load config
    const config = deps.loadConfig();
    config.cwd = cwd;

    // Get git status
    const gitStatus = deps.getGitStatus(cwd);

    // Get GitHub status
    const githubStatus = deps.getGitHubStatus(cwd);

    // Get deps info
    const depsInfo = deps.getDepsInfo(cwd);

    // Extract task info from stdin
    const taskInfo = extractTaskInfo(stdin);

    // Extract agent info from stdin
    const agentInfo = extractAgentInfo(stdin);

    const ctx: RenderContext = {
      stdin,
      gitStatus,
      githubStatus,
      depsInfo,
      taskInfo,
      agentInfo,
      config,
    };

    deps.render(ctx);
  } catch (error) {
    deps.log(
      '[claude-workspace-hud] Error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

const scriptPath = fileURLToPath(import.meta.url);
const argvPath = process.argv[1];
const isSamePath = (a: string, b: string): boolean => {
  try {
    return realpathSync(a) === realpathSync(b);
  } catch {
    return a === b;
  }
};
if (argvPath && isSamePath(argvPath, scriptPath)) {
  void main();
}