import { Component } from 'react';
import { SingleChannel } from '../Components/SingleChannel';
import * as React from 'react';
import { ChannelData, DimmerData } from '../../Common/BoardData';
import { ContextInstance, RootContext } from '../RootContext';
import { MSG_UPDATE_DIMMER, UPDATE_DIMMER } from '../Messages';

interface Props {
    dimmerData: DimmerData
    channelData: ChannelData
}

interface State {

}

export default class DimmersWindow extends Component<Props, State> {

    public static contextType = ContextInstance;
    public context: RootContext;

    public state: State = {

    };

    constructor(props: never) {
        super(props);
    }

    listDimmers() {
        const children = [];

        const dimmerData = this.props.dimmerData;
        const channelData = this.props.channelData;

        for (let i = 0; i < dimmerData.count; i++) {
            const dimVal = dimmerData.values[i];
            const parked = dimVal !== undefined && dimVal !== null;
            const value = parked ? dimmerData.values[i] : channelData.values[i];

            children.push(
                <div
                    className={'luminescence-controlgroup ' + (parked ? 'parked' : '')}
                    key={i}
                >
                    <SingleChannel
                        id={i}
                        sliderVal={value || 0}
                        sliderLabel={dimmerData.names[i] || ''}
                        onSliderChange={(id, val) => {
                            this.context.msgBus.dispatch<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
                                addr: id,
                                value: val
                            });
                        }}
                        onNameChange={(id, name) => {
                            this.context.msgBus.dispatch<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
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

    render() {
        return (
            <div className={'flex'}>
                {this.listDimmers()}
            </div>
        );
    }
}
