

type UnwrapType<T> = T extends object ? { [K in keyof T]: T[K] } : never;

type MapperFunction<TValue, TResult = unknown> = (value: TValue) => TResult;

type Mapper<O> = {
    [P in keyof O]?: MapperFunction<O[P]>;
}

type MapperResult<O, T extends Mapper<O>> = {
    [P in keyof O]: T[P] extends MapperFunction<O[P], infer R> ? R : O[P];
};

type Mapped<O, T extends Mapper<O>> = UnwrapType<MapperResult<O, T>>;

export function mapProps<O extends Record<string, unknown>, T extends Mapper<O>>(obj: O, mapper: T): Mapped<O, T> {
    const result: Partial<MapperResult<O, T>> = {};

    for (const key in obj) {
        const value = obj[key];
        const t = mapper[key];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = (t == null ? value : t(value)) as any;
    }

    return result as Mapped<O, T>;
}