import { env } from '$env/dynamic/private';
import * as pino from 'pino';

export const logger = pino.default(
    pino.transport({
        target: '@axiomhq/pino',
        options: {
            dataset: env.AXIOM_DATASET,
            token: env.AXIOM_TOKEN,
        },
    }),
);