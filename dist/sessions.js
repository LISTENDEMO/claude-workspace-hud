import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
function getProjectSlug(cwd) {
    // Convert path to slug format (similar to how Claude Code does it)
    return cwd
        .replace(/^[\/\\]+/, '')
        .replace(/[\/\\]+$/, '')
        .replace(/[\/\\]/g, '-');
}
function getSessionIdFromFirstLine(filePath) {
    try {
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(1024);
        const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
        fs.closeSync(fd);
        const firstLine = buffer.toString('utf8', 0, bytesRead).split('\n')[0];
        const parsed = JSON.parse(firstLine);
        return parsed.sessionId || null;
    }
    catch {
        return null;
    }
}
export function getSessionList(cwd, currentSessionId) {
    const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
    const projectSlug = getProjectSlug(cwd);
    const projectDir = path.join(claudeDir, 'projects', projectSlug);
    if (!fs.existsSync(projectDir)) {
        return [];
    }
    const sessions = [];
    try {
        const files = fs.readdirSync(projectDir);
        for (const file of files) {
            if (!file.endsWith('.jsonl')) {
                continue;
            }
            const filePath = path.join(projectDir, file);
            try {
                const stats = fs.statSync(filePath);
                const sessionId = getSessionIdFromFirstLine(filePath);
                sessions.push({
                    id: file.replace('.jsonl', ''),
                    path: filePath,
                    createdAt: stats.birthtime,
                    modifiedAt: stats.mtime,
                    size: stats.size,
                    isActive: sessionId === currentSessionId || file.replace('.jsonl', '') === currentSessionId,
                    sessionId: sessionId ?? undefined,
                });
            }
            catch {
                // Skip files that can't be read
                continue;
            }
        }
    }
    catch {
        return [];
    }
    // Sort by modification time (most recent first)
    return sessions.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
}
export function formatSessionDuration(session) {
    const now = Date.now();
    const durationMs = now - session.createdAt.getTime();
    const mins = Math.floor(durationMs / 60000);
    if (mins < 1)
        return '<1m';
    if (mins < 60)
        return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
}
//# sourceMappingURL=sessions.js.map