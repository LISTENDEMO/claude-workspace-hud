export declare const labels: {
    folder: string;
    files: string;
    dirs: string;
    current: string;
    sessions: string;
    other: string;
    initializing: string;
    git: string;
    branch: string;
    staged: string;
    unstaged: string;
    untracked: string;
    ahead: string;
    behind: string;
    clean: string;
    deps: string;
    dependencies: string;
    devDependencies: string;
    noPackageJson: string;
    github: string;
    githubLoggedIn: string;
    githubNotLoggedIn: string;
    githubConnected: string;
    githubNotConnected: string;
    githubNoRemote: string;
    githubCanPush: string;
    githubCannotPush: string;
    githubRepo: string;
    tips: string;
    tipCommands: string;
    tipBrowse: string;
    tipSwitch: string;
    tipConfigure: string;
};
export declare const formatStats: (stats: {
    files: number;
    dirs: number;
}) => string;
export declare const formatGitStatus: (git: {
    branch: string;
    ahead: number;
    behind: number;
    staged: number;
    unstaged: number;
    untracked: number;
    hasChanges: boolean;
}) => string;
export declare const formatDepsInfo: (deps: {
    dependencies: number;
    devDependencies: number;
    hasPackageJson: boolean;
}) => string;
export declare const formatGitHubStatus: (gh: {
    isLoggedIn: boolean;
    hasRemote: boolean;
    repoName: string | null;
    canPush: boolean;
}) => string;
//# sourceMappingURL=zh.d.ts.map