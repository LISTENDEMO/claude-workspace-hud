export const labels = {
  folder: '📁',
  files: 'files',
  dirs: 'dirs',
  current: 'Current',
  sessions: 'sessions',
  other: 'Other',
  initializing: 'Initializing...',
  // Git
  git: '🌿',
  branch: 'branch',
  staged: 'staged',
  unstaged: 'unstaged',
  untracked: 'untracked',
  ahead: 'ahead',
  behind: 'behind',
  clean: 'clean',
  // Dependencies
  deps: '📦',
  dependencies: 'deps',
  devDependencies: 'dev',
  noPackageJson: 'no package.json',
  // GitHub
  github: '🐙',
  githubLoggedIn: 'logged in',
  githubNotLoggedIn: 'not logged in',
  githubConnected: 'connected',
  githubNotConnected: 'not connected',
  githubNoRemote: 'no remote',
  githubCanPush: 'synced',
  githubCannotPush: 'cannot push',
  githubPending: 'pending',
  githubUploaded: 'uploaded',
  githubRepo: 'repo',
  // Tips
  tips: '💡',
  tipCommands: 'Commands',
  tipBrowse: '/browse-files browse tree',
  tipSwitch: '/switch-session switch',
  tipPush: '/push-github push to GitHub',
  tipConfigure: '/claude-workspace-hud:configure',
  // Tasks
  task: '📋',
  tasks: 'tasks',
  currentTask: 'current',
  completed: 'done',
  inProgress: 'active',
  pending: 'pending',
  noTasks: 'no tasks',
  completionRate: 'rate',
  // Agents
  agent: '🤖',
  agents: 'agents',
  running: 'running',
  background: 'bg',
  noAgents: 'none',
};

export const formatStats = (stats: { files: number; dirs: number }): string => {
  return `${stats.files} ${labels.files}, ${stats.dirs} ${labels.dirs}`;
};

export const formatGitStatus = (git: {
  branch: string;
  ahead: number;
  behind: number;
  staged: number;
  unstaged: number;
  untracked: number;
  hasChanges: boolean;
}): string => {
  const parts: string[] = [git.branch];

  if (git.hasChanges) {
    parts.push('*');
  }

  if (git.ahead > 0) {
    parts.push(`↑${git.ahead}`);
  }

  if (git.behind > 0) {
    parts.push(`↓${git.behind}`);
  }

  return parts.join(' ');
};

export const formatDepsInfo = (deps: {
  dependencies: number;
  devDependencies: number;
  hasPackageJson: boolean;
}): string => {
  if (!deps.hasPackageJson) {
    return labels.noPackageJson;
  }

  const parts: string[] = [];

  if (deps.dependencies > 0) {
    parts.push(`${deps.dependencies} deps`);
  }

  if (deps.devDependencies > 0) {
    parts.push(`${deps.devDependencies} dev`);
  }

  return parts.length > 0 ? parts.join(', ') : '0 deps';
};

export const formatGitHubStatus = (gh: {
  isLoggedIn: boolean;
  hasRemote: boolean;
  repoName: string | null;
  canPush: boolean;
}): string => {
  const parts: string[] = [];

  parts.push(labels.github);

  if (!gh.isLoggedIn) {
    parts.push(labels.githubNotLoggedIn);
  } else if (!gh.hasRemote) {
    parts.push(labels.githubLoggedIn);
    parts.push(labels.githubNoRemote);
  } else {
    parts.push(labels.githubConnected);
    if (gh.repoName) {
      parts.push(gh.repoName);
    }
    if (gh.canPush) {
      parts.push(labels.githubCanPush);
    } else {
      parts.push(labels.githubCannotPush);
    }
  }

  return parts.join(' ');
};