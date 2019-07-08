import * as React from 'react';
import { Slider, Text, TextArea } from '@blueprintjs/core';
import { Component } from 'react';

export type SingleChannelProps = {
    id: number;
    sliderVal: number;
    sliderLabel?: string;

    onSliderChange: (id:number, val:number) => void;
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
            <div className={'luminescence-singlechannel'}>
                <div>{this.props.id + 1}</div>
                <Slider
                    className={'slider'}
                    min={0}
                    max={100}
                    stepSize={0.25}
                    labelStepSize={50}
                    labelRenderer={false} //{(val) => `${Math.round(val)}%`}
                    vertical={true}
                    value={this.props.sliderVal}
                    onChange={(value) => {
                        // this.setState({value});
                        this.props.onSliderChange(this.props.id, value);
                    }}
                />
                <input className="bp3-input .modifier"
                       type="text"
                       dir="auto"
                       defaultValue={this.props.sliderLabel} />
            </div>
        );
    }
}
