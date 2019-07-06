export default interface Payload {

}

export class PayloadError extends Error {
    public constructor(msg: string) { super(msg); }
}

export function getOrThrow<T>(required: Array<keyof T>, optional: Array<keyof T>, json: string): T {
    const data = JSON.parse(json);

    const rtn: T = <any>{};
    for (const prop of required) {
        const value = data[prop];

        if (value === undefined) {
            throw new PayloadError(`Missing field: ${prop}`);
        }

        rtn[prop] = value;
    }

    for (const prop of optional) {
        const value = data[prop];

        if (value !== undefined) {
            rtn[prop] = value;
        }
    }

    return rtn;
}
