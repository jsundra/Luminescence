import * as React from 'react';
import { BaseProps, BaseWindow } from './BaseWindow';
import { SingleChannel } from '../Components/SingleChannel';
import { ControlData } from '../../Common/BoardData';
import { MSG_CHANGE_CONTROL } from '../Messages';

interface Props extends BaseProps {
    controls: ControlData;
}

interface State {

}

export default class MasterWindow extends BaseWindow<Props, State> {

    public render(): JSX.Element {
        return (
            <div>
                <SingleChannel
                    id={0}
                    componentLabel={`Grand Master`}
                    sliderVal={this.props.controls.master}
                    onSliderChange={(id, val) => {
                        this.props.msgBus.dispatch<MSG_CHANGE_CONTROL>(MSG_CHANGE_CONTROL, {
                            master: val
                        });
                    }}/>
            </div>
        );
    }
}
