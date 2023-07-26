import fs from 'node:fs/promises';
import path from 'path';

type JsonArray = Array<JsonValue>;
type JsonObject = { [key: string]: JsonValue }
type JsonValue = number | string | boolean | JsonObject | JsonArray | null;

class LocalJsonDb {
    private _filePath: string;
    private _data?: JsonObject;

    private constructor(filePath: string) {
        this._filePath = filePath;
    }

    static open(filePath: string) {
        return new LocalJsonDb(filePath);
    }

    get filePath() {
        return this._filePath;
    }

    private async getData() {
        if (this._data) {
            return this._data
        }

        let data: JsonObject = {};

        try {
            await fs.stat(this._filePath);
            const dir = path.dirname(this._filePath);
            await fs.mkdir(dir, { recursive: true });

            const json = await fs.readFile(this._filePath, 'utf8');
            data = JSON.parse(json);
        } catch {
            const dir = path.dirname(this._filePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(this._filePath, "{}");
        }

        this._data = data;
        return data;
    }

    async set(key: string, value: JsonValue) {
        const jsonData = await this.getData();
        jsonData[key] = value;
        await fs.writeFile(this._filePath, JSON.stringify(jsonData));
    }

    async get(key: string): Promise<JsonValue | undefined> {
        const jsonData = await this.getData();
        return jsonData[key];
    }

    async del(key: string) {
        const jsonData = await this.getData();
        const deleted = jsonData[key];

        delete jsonData[key];

        if (deleted !== undefined) {
            await fs.writeFile(this._filePath, JSON.stringify(jsonData));
        }

        return deleted;
    }

    async has(key: string) {
        return this.get(key) !== undefined;
    }
}

export function openDb(name: string): LocalJsonDb {
    const filePath = path.join(process.cwd(), "jsondb", `${name}.json`);
    return LocalJsonDb.open(filePath)
}