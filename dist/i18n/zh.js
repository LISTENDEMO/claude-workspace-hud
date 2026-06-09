export const labels = {
    folder: '📁',
    files: '文件',
    dirs: '目录',
    current: '当前',
    sessions: '会话',
    other: '其他',
    initializing: '初始化中...',
    // Git
    git: '🌿',
    branch: '分支',
    staged: '已暂存',
    unstaged: '未暂存',
    untracked: '未跟踪',
    ahead: '待推送',
    behind: '待拉取',
    clean: '干净',
    // Dependencies
    deps: '📦',
    dependencies: '依赖',
    devDependencies: '开发依赖',
    noPackageJson: '无 package.json',
    // GitHub
    github: '🐙',
    githubLoggedIn: '已登录',
    githubNotLoggedIn: '未登录',
    githubConnected: '已连接',
    githubNotConnected: '未连接',
    githubNoRemote: '无远程仓库',
    githubCanPush: '已同步',
    githubCannotPush: '无法上传',
    githubPending: '待推送',
    githubUploaded: '已上传',
    githubRepo: '仓库',
    // Tips
    tips: '💡',
    tipCommands: '可用命令',
    tipBrowse: '/browse-files 查看文件树',
    tipSwitch: '/switch-session 切换会话',
    tipPush: '/push-github 推送到GitHub',
    tipConfigure: '/claude-workspace-hud:configure 配置',
    // Tasks
    task: '📋',
    tasks: '任务',
    currentTask: '当前',
    completed: '已完成',
    inProgress: '进行中',
    pending: '待处理',
    noTasks: '无任务',
    completionRate: '完成率',
    // Agents
    agent: '🤖',
    agents: 'Agent',
    running: '运行中',
    background: '后台',
    noAgents: '无运行',
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
//# sourceMappingURL=zh.js.map