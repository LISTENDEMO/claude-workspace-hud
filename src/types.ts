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
  // 任务和后台任务信息
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
  id: string;           // UUID
  path: string;         // File path
  createdAt: Date;      // Creation time
  modifiedAt: Date;     // Last modified time
  size: number;         // File size (bytes)
  isActive: boolean;    // Is current session
  sessionId?: string;   // Session ID from first line
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
  isLoggedIn: boolean;        // gh auth status
  hasRemote: boolean;         // git remote exists
  remoteUrl: string | null;   // GitHub remote URL
  repoName: string | null;    // repo name (owner/repo)
  ahead: number;              // commits to push
  isSynced: boolean;          // no pending commits
}

export interface TaskInfo {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  currentTask: string | null;
  completionRate: number;     // percentage
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