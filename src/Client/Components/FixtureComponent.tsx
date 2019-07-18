import { Component } from 'react';
import { FixtureDisplays } from 'Common/Fixtures/Types';
import * as React from 'react';
import { Fixture } from '../../Common/BoardData';
import { SingleChannel } from './SingleChannel';

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
        const components = fixture.descriptor.components[fixture.mode];
        for (const i in components) {
            const component = components[i];
            children.push(this.addComponent(component, this.props.addr as number, Number.parseInt(i)));
        }

        return children;
    }

    private addComponent(display: FixtureDisplays, addr: number, offset: number): JSX.Element {
        switch(display) {
            case ' ':
                return <SingleChannel id={offset} componentLabel={`${addr}`} sliderVal={0} onSliderChange={() => {}} />
            case 'RGB':
                return <SingleChannel id={offset} sliderClass={'hue-slider'} componentLabel='RGB' sliderVal={0} onSliderChange={() => {}} />
            case 'A':
            case 'W':
            case 'UV':
                return <SingleChannel id={offset} componentLabel={display} sliderVal={0} onSliderChange={() => {}} />
        }
    }

    private onColorChange(offset: number, color: any): void {
        // TODO:
    }

    private onSliderChange(offset: number, intensity: number): void {
        this._values[offset] = intensity;
        this.props.onValueChange(this.props.addr as number, this._values);
    }
}
