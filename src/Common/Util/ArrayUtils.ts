export module ArrayUtils {
    export function fillRange<T>(array: T[], index: number, values: T[]) {
        for (const value of values) {
            array[index++] = value;
        }
    }
}
