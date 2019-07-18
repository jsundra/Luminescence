import * as React from 'react';
import { Component } from 'react';
import { SingleChannel } from '../Components/SingleChannel';
import { DimmerData, DimmerOwnership, OutputData } from '../../Common/BoardData';
import { ContextInstance, RootContext } from '../RootContext';
import { MSG_UPDATE_DIMMER, MSG_UNPARK_DIMMER, MSG_UPDATE_DIMMER } from '../Messages';
import {BaseWindow} from "./BaseWindow";

interface Props {
    outputData: OutputData;
    dimmerData: DimmerData;
}

interface State {

}

export default class DimmersWindow extends BaseWindow<Props, State> {

    public static contextType = ContextInstance;
    public context: RootContext;

    public state: State = {

    };

    constructor(props: never) {
        super(props);
    }

    listDimmers(): JSX.Element[] {
        const children = [];

        const outputData = this.props.outputData;
        const dimmerData = this.props.dimmerData;

        for (let i = 0; i < outputData.values.length; i++) {
            const parked = outputData.owner[i] === DimmerOwnership.Parked;
            const index = i;

            children.push(
                <div
                    className={'luminescence-controlgroup ' + (parked ? 'parked' : '')}
                    key={i}
                >
                    { parked && <img
                        className={'unpark'}
                        src={`/img/icon/unlock.png`}
                        onClick={() => {
                            this.context.msgBus.dispatch<MSG_UNPARK_DIMMER>(MSG_UNPARK_DIMMER, {
                                addr: index
                            });
                        }}
                    />}
                    <SingleChannel
                        id={i}
                        sliderVal={outputData.values[i] || 0}
                        sliderLabel={dimmerData.names[i] || ''}
                        onSliderChange={(id, val) => {
                            this.context.msgBus.dispatch<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
                                addr: id,
                                value: val
                            });
                        }}
                        onNameChange={(id, name) => {
                            this.context.msgBus.dispatch<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
                                addr: id,
                                alias: name
                            });
                        }}
                    />
                </div>
            );
        }

        return children;
    }

    public render() {
        return (
            <div className={'flex-parent'}>
                <div className={'flex'}
                     onClick={e => e.preventDefault()}
                >
                    {this.listDimmers()}
                </div>
            </div>
        );
    }
}
