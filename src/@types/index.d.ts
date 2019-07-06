export namespace Common {
    type Dict<T> = { [key: string ]: T };
}

declare global {
    interface Array<T> {
        fillRange(index: number, values: T | T[]): void;
    }
}
