import React = require('react');
import { Component, ReactNode } from 'react';
import { ScreenTypes } from './Screens/ScreenTypes';
import { Mosaic, MosaicBranch, MosaicWindow } from 'react-mosaic-component';
import { BoardData } from '../Common/BoardData';
import { API } from './API';
import { MSG_DATA_UPDATE } from './Messages';
import { ContextInstance, RootContext } from './RootContext';
import DimmersWindow from './Screens/DimmersWindow';
import ChannelsWindow from './Screens/ChannelsWindow';
import MasterWindow from './Screens/MasterWindow';

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
        };
    }

    public componentWillMount() {
        API.GetBoardData()
            .then(boardData => {
                this.setState({ boardData });
            })
            .catch(reason => {
                console.error(`Error getting board data: ${reason}`);
            }
        );

        this.context.msgBus.subscribe<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data => this.setState({ boardData: data.latest }));
    }

    public render(): ReactNode {
        // TODO: Validate against screens
        let screenParam: any = (new URLSearchParams(location.search)).get('view');
        const defaultScreen: ScreenTypes = (ScreenTypes[screenParam && (screenParam[0].toUpperCase() + screenParam.substring(1))]) as ScreenTypes;

        return (
            <div>
                <Mosaic<ScreenTypes>
                    renderTile={this.createScreen.bind(this)}
                    initialValue={{
                        direction: 'row',
                        first: defaultScreen || ScreenTypes.Dimmers,
                        second: ScreenTypes.Controls,
                        splitPercentage: 90
                    }}
                    className={'mosaic-blueprint-theme bp3-dark'}
                />
            </div>
        )
    }

    private createScreen<T extends ScreenTypes>(type: T, path: MosaicBranch[]): JSX.Element {
        let elm: JSX.Element;
        switch(type) {
            case ScreenTypes.Controls:
                elm = <MasterWindow
                        msgBus={this.context.msgBus}
                        controls={this.state.boardData.controls}
                    />;
                break;
            case ScreenTypes.Dimmers:
                elm = <DimmersWindow
                    msgBus={this.context.msgBus}
                    outputData={this.state.boardData.output}
                    dimmerData={this.state.boardData.dimmers}
                />;
                break;
            case ScreenTypes.Channels:
                elm = <ChannelsWindow
                    msgBus={this.context.msgBus}
                    channelData={this.state.boardData.channels}
                />;
                break;
            default:
                throw new Error('Unknown screen type!');
        }
        return (<MosaicWindow<T> title={type} path={path}>{elm}</MosaicWindow>);
    }
}
