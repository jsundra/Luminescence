import * as React from 'react';
import { Slider } from '@blueprintjs/core';
import { Component } from 'react';

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
                    className={'slider ' + (this.props.sliderClass || '')}
                    min={0}
                    max={this.props.maxValue || 255}
                    stepSize={!this.props.maxValue ? 0.25 : 0.01} //TODO: Pretty this hidden quirk up
                    labelStepSize={50}
                    labelRenderer={false} //{(val) => `${Math.round(val)}%`}
                    vertical={true}
                    value={this.props.sliderVal || 0}
                    showTrackFill={this.props.sliderClass === undefined}
                    onChange={(value) => {
                        // this.setState({value});
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
