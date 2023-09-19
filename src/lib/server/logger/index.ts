function log(level: 'info' | 'warn' | 'error', args: unknown[]) {
    const logFunction = console[level];

    logFunction({ level, ...args })
}

export const logger = {
    info(...args: unknown[]) {
        log('info', args);
    },

    warn(...args: unknown[]) {
        log('warn', args);
    },

    error(...args: unknown[]) {
        log('error', args);
    }
}