import * as React from 'react';
import { Component } from 'react';
import Slider, { Direction } from './Slider';

export type SingleChannelProps = {
    id: number;
    componentLabel: string;
    sliderVal: number;
    sliderLabel?: string;

    sliderClass?: string;

    maxValue?: number;

    onSliderChange: (id: number, val: number) => void;
    onNameChange?: (id: number, name: string) => void;
};

export type SingleChannelState = {
    value: number
};

export class SingleChannel extends Component<SingleChannelProps, SingleChannelState> {

    public state: SingleChannelState = {
        value: 0
    };

    public shouldComponentUpdate(nextProps: SingleChannelProps, nextState: never): boolean {
        return nextProps.sliderVal !== this.props.sliderVal;
    }

    public render() {
        return (
            <div className={'luminescence-singlechannel'} onTouchMove={e => e.preventDefault()}>
                <div>{this.props.componentLabel}</div>
                <Slider
                    min={0}
                    max={255}
                    value={this.props.sliderVal}
                    direction={Direction.Vertical}
                    onChange={value => {
                        this.setState({ value });
                        this.props.onSliderChange(this.props.id, value);
                    }}
                />
                {this.props.onNameChange &&
                <input className="bp3-input"
                       type="text"
                       dir="auto"
                       defaultValue={this.props.sliderLabel}
                       onBlur={(e) => {
                           const newText = e.target.value;
                           if (this.props.sliderLabel !== newText) {
                               this.props.onNameChange(this.props.id, newText);
                           }
                       }}
                />}
            </div>
        );
    }
}
