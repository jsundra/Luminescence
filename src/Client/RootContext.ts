import MessageBus from './MessageBus';
import * as React from 'react';

export interface RootContext {
    msgBus: MessageBus;
}

export const ContextInstance = React.createContext<RootContext>(<any>{});
