type Dict<T> = { [key: string ]: T };
type Nullable<T> = T | null;


declare interface Array<T> {
        fillRange(index: number, values: T | T[]): void;
}
