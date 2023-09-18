import { env } from '$env/dynamic/private';
import { default as pino } from 'pino';

export const logger = pino(
    pino.transport({
        target: '@axiomhq/pino',
        options: {
            dataset: env.AXIOM_DATASET,
            token: env.AXIOM_TOKEN,
        },
    }),
);