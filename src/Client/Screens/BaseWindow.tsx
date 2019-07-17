import { Component } from 'react';

export abstract class BaseWindow<T, K> extends Component<T, K> {

    public constructor(props: any) {
        super(props);
        this.state = {} as any;
    }

}
