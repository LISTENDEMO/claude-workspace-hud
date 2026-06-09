import type { WorkspaceConfig } from './config.js';
export interface StdinData {
    transcript_path?: string;
    cwd?: string;
    workspace?: {
        current_dir?: string;
        project_dir?: string;
        added_dirs?: string[];
    } | null;
    model?: {
        id?: string;
        display_name?: string;
    };
    context_window?: {
        context_window_size?: number;
        used_percentage?: number | null;
    };
    tasks?: {
        total?: number;
        completed?: number;
        in_progress?: number;
        pending?: number;
        current_task?: string | null;
    };
    agents?: {
        total?: number;
        running?: number;
        background?: number;
    };
}
export interface SessionInfo {
    id: string;
    path: string;
    createdAt: Date;
    modifiedAt: Date;
    size: number;
    isActive: boolean;
    sessionId?: string;
}
export interface FileStats {
    totalFiles: number;
    totalDirs: number;
    extensions: Map<string, number>;
}
export interface GitStatus {
    branch: string;
    ahead: number;
    behind: number;
    staged: number;
    unstaged: number;
    untracked: number;
    hasChanges: boolean;
}
export interface DepsInfo {
    dependencies: number;
    devDependencies: number;
    hasPackageJson: boolean;
}
export interface GitHubStatus {
    isLoggedIn: boolean;
    hasRemote: boolean;
    remoteUrl: string | null;
    repoName: string | null;
    ahead: number;
    isSynced: boolean;
}
export interface TaskInfo {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    currentTask: string | null;
    completionRate: number;
}
export interface AgentInfo {
    total: number;
    running: number;
    background: number;
}
export interface RenderContext {
    stdin: StdinData;
    gitStatus: GitStatus | null;
    depsInfo: DepsInfo | null;
    githubStatus: GitHubStatus | null;
    taskInfo: TaskInfo | null;
    agentInfo: AgentInfo | null;
    config: WorkspaceConfig;
}
export type Language = 'en' | 'zh';
//# sourceMappingURL=types.d.ts.map