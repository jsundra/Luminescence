export module Copy {

    export function deep<T extends {[key: string]: any}>(src: T, dst: T): T {
        if (src == null) return null;
        if (dst == null) throw Error('Copy destination cannot be null');

        for (const key of Object.keys(src)) {
            const keyVal = src[key];
            dst[key] = typeof keyVal === 'object' ? deep(keyVal, dst[key] || {}) : keyVal;
        }

        if (!dst.hasOwnProperty('inflate') && typeof dst['inflate'] === 'function') {
            dst.inflate(src);
        }

        return dst;
    }

    export function inflate<T>(type: { new(): T }, src: T): T {
        const dst = new type();
        return Copy.deep(src, dst);
    }
}
