Array.prototype.fillRange = function<T>(this: T[], index: number, values: T[]): void {
    if (typeof values === 'number') {
        this[index] = values;
    } else {
        for (const value of values) {
            this[index++] = value;
        }
    }
};
