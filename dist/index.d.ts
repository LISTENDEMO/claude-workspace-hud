import { readStdin } from './stdin.js';
import { getGitStatus, getDepsInfo, getGitHubStatus } from './files.js';
import { loadConfig } from './config.js';
import { render } from './render.js';
export type MainDeps = {
    readStdin: typeof readStdin;
    getGitStatus: typeof getGitStatus;
    getDepsInfo: typeof getDepsInfo;
    getGitHubStatus: typeof getGitHubStatus;
    loadConfig: typeof loadConfig;
    render: typeof render;
    log: (...args: unknown[]) => void;
};
export declare function main(overrides?: Partial<MainDeps>): Promise<void>;
//# sourceMappingURL=index.d.ts.map