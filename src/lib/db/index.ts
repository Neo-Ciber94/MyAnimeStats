
import path from 'node:path';
import { open } from 'lmdb';

export const db = open({
    path: path.join(process.cwd(), "private", "my-db"),
    name: "myanimelist"
})