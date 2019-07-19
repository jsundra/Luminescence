import { Component } from 'react';
import { FixtureDisplays } from 'Common/Fixtures/Types';
import * as React from 'react';
import { Fixture } from 'Common/BoardData';
import { SingleChannel } from './SingleChannel';
import { ColorUtil } from "../Util/ColorUtil";

export type Props = {
    addr: number | string;
    fixture: Fixture;
    intensities: number[];

    onValueChange: (addr: number, intensities: number[]) => void;
    onAliasChange: (addr: number, alias: string) => void;
};

export type State = {

};

export default class FixtureComponent extends Component<Props, State> {

    private _values: number[] = [];

    public render(): JSX.Element {
        return (
            <div className='luminescence-controlgroup'>
                <div>{this.buildComponents()}</div>

                <input className="bp3-input"
                       type="text"
                       dir="auto"
                       defaultValue={this.props.fixture.alias || this.props.fixture.descriptor.name}
                       onBlur={(e) => {
                           const newText = e.target.value;
                           if (this.props.fixture.alias !== newText) {
                               this.props.onAliasChange(this.props.addr as number, newText);
                           }
                       }}
                />
            </div>
        );
    }

    private buildComponents(): JSX.Element[] {
        const children: JSX.Element[] = [];
        const fixture = this.props.fixture;

        // @ts-ignore
        const controls = fixture.descriptor.components[fixture.mode];
        let addrOffset = 0;

        for (const control of controls) {
            const component = this.addComponent(control, this.props.addr as number, addrOffset);
            addrOffset += component.stride;
            children.push(component.elm);
        }

        return children;
    }

    private addComponent(display: FixtureDisplays, addr: number, offset: number): { elm: JSX.Element, stride: number } {
        switch(display) {
            case ' ':
                return {
                    elm: <SingleChannel
                        id={offset}
                        componentLabel={`${addr}`}
                        sliderVal={this.props.intensities[offset]}
                        onSliderChange={this.onSliderChange.bind(this)}
                    />,
                    stride: 1
                };
            case 'RGB':
                const hue: number = this.props.intensities[offset];
                return {
                    elm: <SingleChannel
                        id={offset}
                        sliderClass={'hue-slider'}
                        componentLabel='RGB'
                        sliderVal={hue}
                        onSliderChange={this.onColorChange.bind(this)}
                    />,
                    stride: 3
                }
            case 'A':
            case 'W':
            case 'UV':
                return {
                    elm: <SingleChannel
                        id={offset}
                        componentLabel={display}
                        sliderVal={this.props.intensities[offset]}
                        onSliderChange={this.onSliderChange.bind(this)}
                    />,
                    stride: 1
                };
        }
    }

    private onColorChange(offset: number, sliderVal: number): void {
        const color = ColorUtil.SliderToRGB(sliderVal);

        this._values[offset] = color.r * 100;
        this._values[offset+1] = color.g * 100;
        this._values[offset+2] = color.b * 100;
        this.props.onValueChange(this.props.addr as number, this._values);
    }

    private onSliderChange(offset: number, intensity: number): void {
        this._values[offset] = intensity;
        this.props.onValueChange(this.props.addr as number, this._values);
    }
}
