export default interface Payload {

}

export class PayloadError extends Error {
    public constructor(msg: string) { super(msg); }
}

export function getOrThrow<T>(json: any, required: Array<keyof T>, optional?: Array<keyof T>): T {
    if (!json) {
        throw new PayloadError('Missing json.');
    }

    const rtn: T = <any>{};
    for (const prop of required) {
        const value = json[prop];

        if (value === undefined) {
            throw new PayloadError(`Missing field - ${prop}`);
        }

        rtn[prop] = value;
    }

    if (optional) {
        for (const prop of optional) {
            const value = json[prop];

            if (value !== undefined) {
                rtn[prop] = value;
            }
        }
    }

    return rtn;
}
