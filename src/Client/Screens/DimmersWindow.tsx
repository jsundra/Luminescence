import { Component } from 'react';
import { SingleChannel } from '../Components/SingleChannel';
import * as React from 'react';
import { DimmerData } from '../../Common/BoardData';
import { ContextInstance, RootContext } from '../RootContext';
import { MSG_UPDATE_DIMMER, UPDATE_DIMMER } from '../Messages';

interface Props {
    dimmerData: DimmerData
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

        const data = this.props.dimmerData;

        for (let i = 0; i < data.count; i++) {
            children.push(
                <div
                    className={'luminescence-controlgroup'}
                    key={i}
                >
                    <SingleChannel
                        id={i}
                        sliderVal={data.values[i] || 0}
                        sliderLabel={data.names[i] || ''}
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
