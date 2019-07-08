export type MessageCallback<T> = (data: T) => void;

export default class MessageBus {

    private readonly _subscriptions: Dict<MessageCallback<{}>[]> = {};

    public constructor() {

    }

    public subscribe<T>(msgName: string, callback: MessageCallback<T>): void {
        const listeners = this.getListeners(msgName);

        listeners.push(callback);
    }

    public unsubscribe<T>(msgName: string, callback: MessageCallback<T>): void {
        const listeners = this.getListeners(msgName);

        listeners.splice(listeners.indexOf(callback), 1);
    }

    public dispatch<T>(msgName: string, data: T): void {
        const listeners = this.getListeners(msgName);

        // TODO: TONS of tests. Projection for unsub during invoke, the whole nine yards.
        for (const listener of listeners) {
            listener(data);
        }
    }

    private getListeners<T>(msgName: string): MessageCallback<T>[] {
        let list = this._subscriptions[msgName];
        if (!list) {
            list = this._subscriptions[msgName] = [];
        }
        return list;
    }
}
