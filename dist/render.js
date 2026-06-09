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
        if (githubStatus.canPush) {
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
        labels.tipBrowse,
        labels.tipSwitch,
    ];
    return colorize(labels.tips + ' ' + tips.join(' | '), 'dim');
}
export function render(ctx) {
    setLanguage(ctx.config.language);
    // Line 1: Git status (without project name, claude-hud shows it)
    const gitLine = renderGitLine(ctx.gitStatus, ctx.config);
    // Line 2: GitHub status
    const githubLine = renderGitHubLine(ctx.githubStatus, ctx.config);
    // Line 3: Dependencies info
    const depsLine = renderDepsLine(ctx.depsInfo, ctx.config);
    // Line 4: Tips
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
    if (tipsLine) {
        console.log(tipsLine);
    }
}
//# sourceMappingURL=render.js.map