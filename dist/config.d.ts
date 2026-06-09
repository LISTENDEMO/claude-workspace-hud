import type { Language } from './types.js';
export interface WorkspaceConfig {
    cwd?: string;
    language: Language;
    display: {
        showGitStatus: boolean;
        showGitHub: boolean;
        showDepsInfo: boolean;
        showTips: boolean;
    };
    colors: {
        folder: string;
        git: string;
        github: string;
        deps: string;
        tip: string;
        label: string;
    };
}
export declare const DEFAULT_CONFIG: WorkspaceConfig;
export declare function loadConfig(): WorkspaceConfig;
//# sourceMappingURL=config.d.ts.map