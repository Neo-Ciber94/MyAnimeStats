import { env } from '$env/dynamic/private';
import { default as axiomhq } from '@axiomhq/js';

const axiom = new axiomhq.Axiom({
    token: env.AXIOM_TOKEN,
    orgId: env.AXIOM_ORG_ID,
});

function log(level: 'info' | 'warn' | 'fatal', args: unknown[]) {
    axiom.ingest(env.AXIOM_DATASET, [{ level }, ...args]);
    axiom.flush();
}

export const logger = {
    info(...args: unknown[]) {
        log('info', args);
    },

    warn(...args: unknown[]) {
        log('warn', args);
    },

    fatal(...args: unknown[]) {
        log('fatal', args);
    }
}