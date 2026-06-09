import * as en from './en.js';
import * as zh from './zh.js';
let currentLanguage = 'en';
export function setLanguage(lang) {
    currentLanguage = lang;
}
export function getLabels() {
    return currentLanguage === 'zh' ? zh : en;
}
export function t(key) {
    const labels = getLabels().labels;
    return labels[key];
}
export { formatStats, formatGitStatus, formatDepsInfo, formatGitHubStatus } from './en.js';
export { formatStats as formatStatsZh, formatGitStatus as formatGitStatusZh, formatDepsInfo as formatDepsInfoZh, formatGitHubStatus as formatGitHubStatusZh } from './zh.js';
//# sourceMappingURL=index.js.map