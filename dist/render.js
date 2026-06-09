import { setLanguage, getLabels } from './i18n/index.js';
const ANSI_COLORS = {
    dim: '\x1b[2m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    reset: '\x1b[0m',
};
function colorize(text, colorName) {
    const color = ANSI_COLORS[colorName] || ANSI_COLORS.dim;
    return `${color}${text}${ANSI_COLORS.reset}`;
}
function renderGitLine(gitStatus, config) {
    const labels = getLabels().labels;
    if (!config.display.showGitStatus) {
        return '';
    }
    // If no git, don't show anything (claude-hud already shows project name)
    if (!gitStatus) {
        return '';
    }
    const parts = [];
    // Git icon and branch
    parts.push(colorize(labels.git, config.colors.git));
    parts.push(colorize(gitStatus.branch, config.colors.git));
    // Changes indicator
    if (gitStatus.hasChanges) {
        parts.push('*');
    }
    // Ahead/behind
    if (gitStatus.ahead > 0) {
        parts.push(colorize(`↑${gitStatus.ahead}`, 'green'));
    }
    if (gitStatus.behind > 0) {
        parts.push(colorize(`↓${gitStatus.behind}`, 'red'));
    }
    // Change counts
    if (gitStatus.staged > 0 || gitStatus.unstaged > 0 || gitStatus.untracked > 0) {
        const changeParts = [];
        if (gitStatus.staged > 0)
            changeParts.push(`+${gitStatus.staged}`);
        if (gitStatus.unstaged > 0)
            changeParts.push(`~${gitStatus.unstaged}`);
        if (gitStatus.untracked > 0)
            changeParts.push(`?${gitStatus.untracked}`);
        parts.push(colorize(changeParts.join(' '), 'yellow'));
    }
    return parts.join(' ');
}
function renderGitHubLine(githubStatus, config) {
    const labels = getLabels().labels;
    if (!config.display.showGitHub) {
        return '';
    }
    if (!githubStatus) {
        return '';
    }
    const parts = [];
    // GitHub icon
    parts.push(colorize(labels.github, 'magenta'));
    if (!githubStatus.isLoggedIn) {
        // Not logged in
        parts.push(colorize(labels.githubNotLoggedIn, 'red'));
    }
    else if (!githubStatus.hasRemote) {
        // Logged in but no remote
        parts.push(colorize(labels.githubLoggedIn, 'green'));
        parts.push(colorize(labels.githubNoRemote, 'dim'));
    }
    else {
        // Connected
        parts.push(colorize(labels.githubConnected, 'green'));
        if (githubStatus.repoName) {
            parts.push(colorize(githubStatus.repoName, 'cyan'));
        }
        // Show sync status
        if (githubStatus.ahead > 0) {
            parts.push(colorize(`${labels.githubPending} ${githubStatus.ahead}`, 'yellow'));
        }
        else if (githubStatus.isSynced) {
            parts.push(colorize(labels.githubCanPush, 'green'));
        }
    }
    return parts.join(' ');
}
function renderDepsLine(depsInfo, config) {
    const labels = getLabels().labels;
    if (!depsInfo || !config.display.showDepsInfo) {
        return '';
    }
    const parts = [];
    parts.push(colorize(labels.deps, 'cyan'));
    if (!depsInfo.hasPackageJson) {
        parts.push(colorize(labels.noPackageJson, 'dim'));
    }
    else {
        const depParts = [];
        if (depsInfo.dependencies > 0) {
            depParts.push(`${depsInfo.dependencies} ${labels.dependencies}`);
        }
        if (depsInfo.devDependencies > 0) {
            depParts.push(`${depsInfo.devDependencies} ${labels.devDependencies}`);
        }
        if (depParts.length > 0) {
            parts.push(depParts.join(', '));
        }
        else {
            parts.push('0 deps');
        }
    }
    return parts.join(' ');
}
function renderTipsLine(config) {
    const labels = getLabels().labels;
    if (!config.display.showTips) {
        return '';
    }
    const tips = [
        labels.tipPush,
        labels.tipBrowse,
        labels.tipSwitch,
    ];
    return colorize(labels.tips + ' ' + tips.join(' | '), 'dim');
}
function renderTaskLine(taskInfo, config) {
    const labels = getLabels().labels;
    if (!config.display.showTasks) {
        return '';
    }
    if (!taskInfo || taskInfo.total === 0) {
        return colorize(`${labels.task} ${labels.noTasks}`, 'dim');
    }
    const parts = [];
    // Task icon
    parts.push(colorize(labels.task, config.colors.task));
    // Current task (truncated if too long)
    if (taskInfo.currentTask) {
        const taskDisplay = taskInfo.currentTask.length > 30
            ? taskInfo.currentTask.substring(0, 30) + '...'
            : taskInfo.currentTask;
        parts.push(colorize(taskDisplay, 'cyan'));
    }
    // Progress: completed/total
    parts.push(`${taskInfo.completed}/${taskInfo.total}`);
    // Completion rate with color based on percentage
    const rate = taskInfo.completionRate;
    if (rate >= 80) {
        parts.push(colorize(`${rate}%`, 'green'));
    }
    else if (rate >= 50) {
        parts.push(colorize(`${rate}%`, 'yellow'));
    }
    else {
        parts.push(colorize(`${rate}%`, 'red'));
    }
    // Progress bar
    const barLength = 10;
    const filled = Math.round(rate / 100 * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    parts.push(colorize(bar, 'dim'));
    return parts.join(' ');
}
function renderAgentLine(agentInfo, config) {
    const labels = getLabels().labels;
    if (!config.display.showAgents) {
        return '';
    }
    if (!agentInfo || (agentInfo.running === 0 && agentInfo.background === 0)) {
        return colorize(`${labels.agent} ${labels.noAgents}`, 'dim');
    }
    const parts = [];
    // Agent icon
    parts.push(colorize(labels.agent, config.colors.agent));
    // Running agents
    if (agentInfo.running > 0) {
        parts.push(colorize(`${labels.running} ${agentInfo.running}`, 'green'));
    }
    // Background agents
    if (agentInfo.background > 0) {
        parts.push(colorize(`${labels.background} ${agentInfo.background}`, 'yellow'));
    }
    // Total
    parts.push(colorize(`(${agentInfo.total})`, 'dim'));
    return parts.join(' ');
}
export function render(ctx) {
    setLanguage(ctx.config.language);
    // Line 1: Git status (without project name, claude-hud shows it)
    const gitLine = renderGitLine(ctx.gitStatus, ctx.config);
    // Line 2: GitHub status
    const githubLine = renderGitHubLine(ctx.githubStatus, ctx.config);
    // Line 3: Dependencies info
    const depsLine = renderDepsLine(ctx.depsInfo, ctx.config);
    // Line 4: Task status
    const taskLine = renderTaskLine(ctx.taskInfo, ctx.config);
    // Line 5: Agent status
    const agentLine = renderAgentLine(ctx.agentInfo, ctx.config);
    // Line 6: Tips
    const tipsLine = renderTipsLine(ctx.config);
    // Output - only show if there's data
    if (gitLine) {
        console.log(gitLine);
    }
    if (githubLine) {
        console.log(githubLine);
    }
    if (depsLine) {
        console.log(depsLine);
    }
    if (taskLine) {
        console.log(taskLine);
    }
    if (agentLine) {
        console.log(agentLine);
    }
    if (tipsLine) {
        console.log(tipsLine);
    }
}
//# sourceMappingURL=render.js.map