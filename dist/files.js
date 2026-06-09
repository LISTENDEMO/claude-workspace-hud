import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
const IGNORE_DIRS = new Set([
    'node_modules',
    '.git',
    '.claude',
    'dist',
    'build',
    '.cache',
    'coverage',
    '.next',
    '.nuxt',
]);
// Convert Git Bash/MSYS path to Windows path
function normalizePath(cwd) {
    // Handle Git Bash paths like /c/Users/... or /g/...
    if (cwd.match(/^\/[a-zA-Z]\//)) {
        // Convert /c/path to C:/path
        const driveLetter = cwd.charAt(1).toUpperCase();
        const rest = cwd.slice(2);
        return `${driveLetter}:${rest}`;
    }
    return cwd;
}
export function getGitStatus(cwd) {
    const normalizedCwd = normalizePath(cwd);
    try {
        // Check if it's a git repository
        execSync('git rev-parse --is-inside-work-tree', {
            cwd: normalizedCwd,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        // Get branch name
        let branch = 'unknown';
        try {
            branch = execSync('git branch --show-current', {
                cwd: normalizedCwd,
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            // If no branch (detached HEAD), get short commit hash
            if (!branch) {
                branch = execSync('git rev-parse --short HEAD', {
                    cwd: normalizedCwd,
                    encoding: 'utf8',
                    stdio: ['pipe', 'pipe', 'pipe']
                }).trim();
                branch = `HEAD:${branch}`;
            }
        }
        catch {
            branch = 'unknown';
        }
        // Get ahead/behind counts
        let ahead = 0;
        let behind = 0;
        try {
            const result = execSync('git rev-list --left-right --count HEAD@{upstream}...HEAD 2>/dev/null || echo "0 0"', {
                cwd: normalizedCwd,
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            const parts = result.split('\t');
            if (parts.length === 2) {
                behind = parseInt(parts[0], 10) || 0;
                ahead = parseInt(parts[1], 10) || 0;
            }
        }
        catch {
            // No upstream or other error
        }
        // Get file status counts
        let staged = 0;
        let unstaged = 0;
        let untracked = 0;
        try {
            const status = execSync('git status --porcelain', {
                cwd: normalizedCwd,
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe']
            });
            const lines = status.trim().split('\n').filter(Boolean);
            for (const line of lines) {
                const code = line.substring(0, 2);
                if (code.includes('?')) {
                    untracked++;
                }
                else if (code.match(/[MADRC]/)) {
                    staged++;
                }
                else if (code.match(/[MADRC]./)) {
                    unstaged++;
                }
                else {
                    unstaged++;
                }
            }
        }
        catch {
            // Git status failed
        }
        const hasChanges = staged > 0 || unstaged > 0 || untracked > 0;
        return {
            branch,
            ahead,
            behind,
            staged,
            unstaged,
            untracked,
            hasChanges,
        };
    }
    catch {
        // Not a git repository
        return null;
    }
}
export function getDepsInfo(cwd) {
    const normalizedCwd = normalizePath(cwd);
    const packageJsonPath = path.join(normalizedCwd, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        return {
            dependencies: 0,
            devDependencies: 0,
            hasPackageJson: false,
        };
    }
    try {
        const content = fs.readFileSync(packageJsonPath, 'utf8');
        const pkg = JSON.parse(content);
        const dependencies = Object.keys(pkg.dependencies || {}).length;
        const devDependencies = Object.keys(pkg.devDependencies || {}).length;
        return {
            dependencies,
            devDependencies,
            hasPackageJson: true,
        };
    }
    catch {
        return {
            dependencies: 0,
            devDependencies: 0,
            hasPackageJson: true, // Has file but couldn't parse
        };
    }
}
// Keep for backward compatibility, but not used
export function getFileStats(cwd, maxDepth = 2) {
    const stats = {
        totalFiles: 0,
        totalDirs: 0,
        extensions: new Map(),
    };
    const normalizedCwd = normalizePath(cwd);
    function scan(dir, depth) {
        if (depth > maxDepth)
            return;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (IGNORE_DIRS.has(entry.name))
                    continue;
                if (entry.isDirectory()) {
                    stats.totalDirs++;
                    scan(path.join(dir, entry.name), depth + 1);
                }
                else if (entry.isFile() && !entry.name.startsWith('.')) {
                    stats.totalFiles++;
                    const ext = path.extname(entry.name) || '.其他';
                    const count = stats.extensions.get(ext) || 0;
                    stats.extensions.set(ext, count + 1);
                }
            }
        }
        catch {
            return;
        }
    }
    scan(normalizedCwd, 0);
    return stats;
}
export function getTopExtensions(stats, max) {
    const sorted = Array.from(stats.extensions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, max);
    return new Map(sorted);
}
export function getGitHubStatus(cwd) {
    const normalizedCwd = normalizePath(cwd);
    // Check if gh CLI is available
    let isLoggedIn = false;
    try {
        const result = execSync('gh auth status', {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 5000
        });
        isLoggedIn = result.includes('Logged in');
    }
    catch {
        // gh not logged in or not available
        try {
            // Try alternative check
            execSync('gh api user', {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 5000
            });
            isLoggedIn = true;
        }
        catch {
            isLoggedIn = false;
        }
    }
    // Check for GitHub remote
    let hasRemote = false;
    let remoteUrl = null;
    let repoName = null;
    let ahead = 0;
    try {
        const remotes = execSync('git remote -v', {
            cwd: normalizedCwd,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        }).trim();
        // Look for GitHub remote
        const lines = remotes.split('\n');
        for (const line of lines) {
            if (line.includes('github.com')) {
                hasRemote = true;
                // Extract URL
                const match = line.match(/github\.com[:/]([^.\s]+)/);
                if (match) {
                    repoName = match[1];
                }
                // Extract full URL
                const urlMatch = line.match(/(https?:\/\/github\.com\/[^.\s]+|git@github\.com:[^.\s]+)/);
                if (urlMatch) {
                    remoteUrl = urlMatch[1];
                }
                break;
            }
        }
        // Get ahead count (commits to push)
        if (hasRemote) {
            try {
                const aheadResult = execSync('git rev-list --count @{upstream}..HEAD 2>/dev/null || echo 0', {
                    cwd: normalizedCwd,
                    encoding: 'utf8',
                    stdio: ['pipe', 'pipe', 'pipe']
                }).trim();
                ahead = parseInt(aheadResult, 10) || 0;
            }
            catch {
                ahead = 0;
            }
        }
    }
    catch {
        // Not a git repo or no remotes
    }
    // isSynced if logged in, has remote, and no pending commits
    const isSynced = isLoggedIn && hasRemote && ahead === 0;
    return {
        isLoggedIn,
        hasRemote,
        remoteUrl,
        repoName,
        ahead,
        isSynced,
    };
}
//# sourceMappingURL=files.js.map