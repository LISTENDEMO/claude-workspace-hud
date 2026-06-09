import { readStdin } from './stdin.js';
import { getGitStatus, getDepsInfo, getGitHubStatus } from './files.js';
import { loadConfig } from './config.js';
import { render } from './render.js';
import { setLanguage, t } from './i18n/index.js';
import type { RenderContext } from './types.js';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';

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

    const ctx: RenderContext = {
      stdin,
      gitStatus,
      githubStatus,
      depsInfo,
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