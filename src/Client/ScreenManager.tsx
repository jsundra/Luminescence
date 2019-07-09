import React = require('react');
import { Component, PureComponent, ReactNode } from 'react';
import { ScreenTypes } from './Screens/ScreenTypes';
import { Mosaic, MosaicBranch, MosaicWindow } from 'react-mosaic-component';
import PatchWindow from './Screens/PatchWindow';
import DimmersWindow from './Screens/DimmersWindow';
import { BoardData } from '../Common/BoardData';
import { API } from './API';
import MessageBus from './MessageBus';
import { MSG_UPDATE_DIMMER, UPDATE_DIMMER } from './Messages';
import { ContextInstance, RootContext } from './RootContext';

interface State {
    boardData: BoardData;
}

export default class ScreenManager extends Component<{}, State> {

    public static contextType = ContextInstance;
    public context: RootContext;

    public constructor(props: never) {
        super(props);

        console.log(this);

        this.state = {
            boardData: new BoardData()
        }
    }


    public componentWillMount() {
        API.GetBoardData()
            .then(boardData => {
                console.log('New data!', boardData);
                this.setState({ boardData });
            })
            .catch(reason => {
                console.error(`Error getting board data: ${reason}`);
            });

        this.context.msgBus.subscribe<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, (msg) => {
            const boardData = this.state.boardData;

            if (msg.value) {
                boardData.dimmers.values[msg.addr] = msg.value;
            }

            if (msg.alias) {
                boardData.dimmers.names[msg.addr] = msg.alias;
            }

            this.setState({ boardData });
        })
    }

    public render(): ReactNode {
        return (
            <div>
                <Mosaic<ScreenTypes>
                    renderTile={this.createScreen.bind(this)}
                    initialValue='Dimmers'
                    className={'mosaic-blueprint-theme bp3-dark'}
                />
            </div>
        )
    }

    private createScreen<T extends ScreenTypes>(type: T, path: MosaicBranch[]): JSX.Element {
        let elm: JSX.Element;
        switch(type) {
            case 'Patch':
                elm = <PatchWindow/>;
                break;
            case 'Dimmers':
                elm = <DimmersWindow
                    dimmerData={this.state.boardData.dimmers}
                    channelData={this.state.boardData.channels}
                />;
                break;
        }
        return (<MosaicWindow<T> title={type} path={path}>{elm}</MosaicWindow>);
    }
}
