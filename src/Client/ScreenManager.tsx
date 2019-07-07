import React = require('react');
import { PureComponent, ReactNode } from 'react';
import Patch from './Screens/Patch';

export default class ScreenManager extends PureComponent<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render(): ReactNode {
        return (
            <Patch/>
        )
    }
}
