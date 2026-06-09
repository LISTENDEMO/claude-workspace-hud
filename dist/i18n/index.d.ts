import type { Language } from '../types.js';
import * as en from './en.js';
export declare function setLanguage(lang: Language): void;
export declare function getLabels(): typeof en;
export declare function t(key: keyof typeof en.labels): string;
export { formatStats, formatGitStatus, formatDepsInfo, formatGitHubStatus } from './en.js';
export { formatStats as formatStatsZh, formatGitStatus as formatGitStatusZh, formatDepsInfo as formatDepsInfoZh, formatGitHubStatus as formatGitHubStatusZh } from './zh.js';
//# sourceMappingURL=index.d.ts.map