import React = require('react');
import { PureComponent, ReactNode } from 'react';
import { ScreenTypes } from './Screens/ScreenTypes';
import { Mosaic, MosaicBranch, MosaicWindow } from 'react-mosaic-component';
import PatchWindow from './Screens/PatchWindow';

function createScreen<T extends ScreenTypes>(type: T, path: MosaicBranch[]): JSX.Element {
    let elm: JSX.Element;
    switch(type) {
        case 'Patch':
            elm = <PatchWindow/>
            break;
    }
    return (<MosaicWindow<T> title={type} path={path}>{elm}</MosaicWindow>);
}

export default class ScreenManager extends PureComponent<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render(): ReactNode {
        return (
            <div>
                <Mosaic<ScreenTypes>
                    renderTile={createScreen}
                    initialValue='Patch'
                    className={'mosaic-blueprint-theme bp3-dark'}
                />
            </div>
        )
    }
}
