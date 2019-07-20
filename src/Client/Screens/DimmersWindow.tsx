import * as React from 'react';
import { SingleChannel } from '../Components/SingleChannel';
import { DimmerData, DimmerOwnership, OutputData } from '../../Common/BoardData';
import { MSG_UPDATE_DIMMER, MSG_UNPARK_DIMMER } from '../Messages';
import { BaseProps, BaseWindow } from "./BaseWindow";

interface Props extends BaseProps {
    outputData: OutputData;
    dimmerData: DimmerData;
}

interface State {

}

export default class DimmersWindow extends BaseWindow<Props, State> {

    constructor(props: never) {
        super(props);
    }

    listDimmers(): JSX.Element[] {
        const children = [];

        const outputData = this.props.outputData;
        const dimmerData = this.props.dimmerData;

        for (let i = 1; i < outputData.values.length; i++) {
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
                            this.props.msgBus.dispatch<MSG_UNPARK_DIMMER>(MSG_UNPARK_DIMMER, {
                                addr: index
                            });
                        }}
                    />}
                    <SingleChannel
                        id={i}
                        componentLabel={`${i}`}
                        sliderVal={outputData.values[i] || 0}
                        sliderLabel={dimmerData.names[i] || ''}
                        onSliderChange={(id, val) => {
                            this.props.msgBus.dispatch<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
                                addr: id,
                                value: val
                            });
                        }}
                        onNameChange={(id, name) => {
                            this.props.msgBus.dispatch<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, {
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
