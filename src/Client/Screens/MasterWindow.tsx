import * as React from 'react';
import { BaseProps, BaseWindow } from './BaseWindow';
import { ControlData } from '../../Common/BoardData';
import Slider, { Direction } from '../Components/Slider';
import { MSG_CHANGE_CONTROL } from '../Messages';

interface Props extends BaseProps {
    controls: ControlData;
}

interface State {

}

export default class MasterWindow extends BaseWindow<Props, State> {

    public render(): JSX.Element {
        return (
            <div className={'luminescence-controlgroup'} style={{width: '105px'}}>
                <Slider
                    min={0}
                    max={1}
                    value={this.props.controls.master}
                    direction={Direction.Vertical}

                    label='Grand Master'


                    onChange={val => {
                        this.props.msgBus.dispatch<MSG_CHANGE_CONTROL>(MSG_CHANGE_CONTROL, {
                            master: val
                        });
                    }}
                />
            </div>
        );
    }
}
