import type { GitStatus, DepsInfo, GitHubStatus } from './types.js';
export declare function getGitStatus(cwd: string): GitStatus | null;
export declare function getDepsInfo(cwd: string): DepsInfo;
export declare function getFileStats(cwd: string, maxDepth?: number): {
    totalFiles: number;
    totalDirs: number;
    extensions: Map<string, number>;
};
export declare function getTopExtensions(stats: {
    extensions: Map<string, number>;
}, max: number): Map<string, number>;
export declare function getGitHubStatus(cwd: string): GitHubStatus | null;
//# sourceMappingURL=files.d.ts.map