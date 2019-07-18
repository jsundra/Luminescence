import { Component } from 'react';
import { ContextInstance, RootContext } from "../RootContext";
import MessageBus from '../MessageBus';

export interface BaseProps {
    msgBus: MessageBus;
}

export abstract class BaseWindow<T extends BaseProps, K> extends Component<T, K> {

    public constructor(props: any) {
        super(props);
        this.state = {} as any;
    }
}
