const DEFAULT_FIRST_BYTE_TIMEOUT_MS = 250;
const DEFAULT_IDLE_TIMEOUT_MS = 30;
const DEFAULT_MAX_STDIN_BYTES = 256 * 1024;
export async function readStdin(stream = process.stdin, options = {}) {
    if (stream.isTTY) {
        return null;
    }
    const firstByteTimeoutMs = options.firstByteTimeoutMs ?? DEFAULT_FIRST_BYTE_TIMEOUT_MS;
    const idleTimeoutMs = options.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_STDIN_BYTES;
    try {
        stream.setEncoding('utf8');
    }
    catch {
        return null;
    }
    return await new Promise((resolve) => {
        let raw = '';
        let settled = false;
        let sawData = false;
        let firstByteTimer;
        let idleTimer;
        const cleanup = () => {
            if (firstByteTimer) {
                clearTimeout(firstByteTimer);
                firstByteTimer = undefined;
            }
            if (idleTimer) {
                clearTimeout(idleTimer);
                idleTimer = undefined;
            }
            stream.off('data', onData);
            stream.off('end', onEnd);
            stream.off('error', onError);
            stream.pause();
        };
        const finish = (value) => {
            if (settled) {
                return;
            }
            settled = true;
            cleanup();
            resolve(value);
        };
        const tryParse = () => {
            const trimmed = raw.trim();
            if (!trimmed) {
                return null;
            }
            try {
                return JSON.parse(trimmed);
            }
            catch {
                return undefined;
            }
        };
        const scheduleIdleParse = () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            idleTimer = setTimeout(() => {
                const parsed = tryParse();
                finish(parsed ?? null);
            }, idleTimeoutMs);
        };
        const onData = (chunk) => {
            sawData = true;
            if (firstByteTimer) {
                clearTimeout(firstByteTimer);
                firstByteTimer = undefined;
            }
            raw += String(chunk);
            if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
                finish(null);
                return;
            }
            const parsed = tryParse();
            if (parsed !== undefined) {
                finish(parsed);
                return;
            }
            scheduleIdleParse();
        };
        const onEnd = () => {
            const parsed = tryParse();
            finish(parsed ?? null);
        };
        const onError = () => {
            finish(null);
        };
        firstByteTimer = setTimeout(() => {
            if (!sawData) {
                finish(null);
            }
        }, firstByteTimeoutMs);
        stream.on('data', onData);
        stream.on('end', onEnd);
        stream.on('error', onError);
    });
}
//# sourceMappingURL=stdin.js.map