import type { StdinData } from './types.js';
type StdinStream = Pick<NodeJS.ReadStream, 'setEncoding' | 'on' | 'off' | 'pause'> & {
    isTTY?: boolean;
};
type ReadStdinOptions = {
    firstByteTimeoutMs?: number;
    idleTimeoutMs?: number;
    maxBytes?: number;
};
export declare function readStdin(stream?: StdinStream, options?: ReadStdinOptions): Promise<StdinData | null>;
export {};
//# sourceMappingURL=stdin.d.ts.map