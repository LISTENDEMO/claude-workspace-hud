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
    githubCanPush: 'can push',
    githubCannotPush: 'cannot push',
    githubRepo: 'repo',
    // Tips
    tips: '💡',
    tipCommands: 'Commands',
    tipBrowse: '/browse-files browse tree',
    tipSwitch: '/switch-session switch',
    tipConfigure: '/claude-workspace-hud:configure',
};
export const formatStats = (stats) => {
    return `${stats.files} ${labels.files}, ${stats.dirs} ${labels.dirs}`;
};
export const formatGitStatus = (git) => {
    const parts = [git.branch];
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
export const formatDepsInfo = (deps) => {
    if (!deps.hasPackageJson) {
        return labels.noPackageJson;
    }
    const parts = [];
    if (deps.dependencies > 0) {
        parts.push(`${deps.dependencies} deps`);
    }
    if (deps.devDependencies > 0) {
        parts.push(`${deps.devDependencies} dev`);
    }
    return parts.length > 0 ? parts.join(', ') : '0 deps';
};
export const formatGitHubStatus = (gh) => {
    const parts = [];
    parts.push(labels.github);
    if (!gh.isLoggedIn) {
        parts.push(labels.githubNotLoggedIn);
    }
    else if (!gh.hasRemote) {
        parts.push(labels.githubLoggedIn);
        parts.push(labels.githubNoRemote);
    }
    else {
        parts.push(labels.githubConnected);
        if (gh.repoName) {
            parts.push(gh.repoName);
        }
        if (gh.canPush) {
            parts.push(labels.githubCanPush);
        }
        else {
            parts.push(labels.githubCannotPush);
        }
    }
    return parts.join(' ');
};
//# sourceMappingURL=en.js.map