import { Component } from 'react';
import { ContextInstance, RootContext } from "../RootContext";

export abstract class BaseWindow<T, K> extends Component<T, K> {

    public static contentType = ContextInstance;
    public context: RootContext;

    public constructor(props: any) {
        super(props);
        this.state = {} as any;
    }

}
