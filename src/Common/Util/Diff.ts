export module Diff {

    // TODO: Test the hell out of this.
    export function notEqual<T extends {[key: string]: any}>(a: T, b: T): boolean {
        if (a == null && b == null) return false;
        if (a == null || b == null) return true;

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return true;

        for (const key of aKeys) {
            const aVal = a[key];
            const bVal = b[key];

            if (typeof aVal === 'object' && typeof bVal === 'object') {
                if (notEqual(aVal, bVal)) return true;
                continue;
            }

            if (a[key] !== b[key]) return false;
        }
    }
}
