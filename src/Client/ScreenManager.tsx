import React = require('react');
import { Component, ReactNode } from 'react';
import { ScreenTypes } from './Screens/ScreenTypes';
import { Mosaic, MosaicBranch, MosaicWindow } from 'react-mosaic-component';
import DimmersWindow from './Screens/DimmersWindow';
import { BoardData, DimmerOwnership } from '../Common/BoardData';
import { API } from './API';
import { MSG_UPDATE_DIMMER, UNPARK_DIMMER, UPDATE_DIMMER } from './Messages';
import { ContextInstance, RootContext } from './RootContext';
import ChannelsWindow from './Screens/ChannelsWindow';

interface State {
    boardData: BoardData;
}

export default class ScreenManager extends Component<{}, State> {

    public static contextType = ContextInstance;
    public context: RootContext;

    public constructor(props: never) {
        super(props);

        this.state = {
            boardData: new BoardData()
        }
    }


    public componentWillMount() {
        API.GetBoardData()
            .then(boardData => {
                this.setState({ boardData });
            })
            .catch(reason => {
                console.error(`Error getting board data: ${reason}`);
            });

        // TODO: Get updated state from server!!!

        this.context.msgBus.subscribe<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, (msg) => {
            const boardData = this.state.boardData;

            if (msg.value) {
                boardData.output.values[msg.addr] = msg.value;
            }

            if (msg.alias) {
                boardData.dimmers.names[msg.addr] = msg.alias;
            }

            boardData.output.owner[msg.addr] = DimmerOwnership.Parked;

            this.setState({ boardData });
        });

        this.context.msgBus.subscribe<UNPARK_DIMMER>(UNPARK_DIMMER, (msg) => {
            const boardData = this.state.boardData;
            boardData.output.owner[msg.addr] = DimmerOwnership.Relinquished;
            this.setState({ boardData });
        });
    }

    public render(): ReactNode {
        // TODO: Validate against screens
        let screenParam: any = (new URLSearchParams(location.search)).get('view');
        const defaultScreen: ScreenTypes = (ScreenTypes[screenParam && (screenParam[0].toUpperCase() + screenParam.substring(1))]) as ScreenTypes;

        return (
            <div>
                <Mosaic<ScreenTypes>
                    renderTile={this.createScreen.bind(this)}
                    initialValue={defaultScreen || ScreenTypes.Dimmers}
                    className={'mosaic-blueprint-theme bp3-dark'}
                />
            </div>
        )
    }

    private createScreen<T extends ScreenTypes>(type: T, path: MosaicBranch[]): JSX.Element {
        let elm: JSX.Element;
        switch(type) {
            case 'Dimmers':
                elm = <DimmersWindow
                    outputData={this.state.boardData.output}
                    dimmerData={this.state.boardData.dimmers}
                />;
                break;
            case 'Channels':
                elm = <ChannelsWindow
                    channelData={this.state.boardData.channels}
                />;
                break;
        }
        return (<MosaicWindow<T> title={type} path={path}>{elm}</MosaicWindow>);
    }
}
