import { Component } from 'react';
import { FixtureDisplays } from 'Common/Fixtures/Types';
import * as React from 'react';
import { Fixture } from '../../Common/BoardData';
import { SingleChannel } from './SingleChannel';

export type Props = {
    fixture: Fixture;

    onAliasChange: (fixture: Fixture) => void;
};

export type State = {

};

export default class FixtureComponent extends Component<Props, State> {

    private buildComponents(): JSX.Element[] {
        const children: JSX.Element[] = [];
        const fixture = this.props.fixture;

        for (const component of fixture.descriptor.components[fixture.mode]) {
            children.push(this.addComponent(component, 0));
        }

        return children;
    }

    private addComponent(display: FixtureDisplays, addr: number): JSX.Element {
        switch(display) {
            case ' ':
                return <SingleChannel id={addr} componentLabel={`${addr+1}`} sliderVal={0} onSliderChange={() => {}} />
            case 'RGB':
                return <SingleChannel id={addr} sliderClass={'hue-slider'} componentLabel='RGB' sliderVal={0} onSliderChange={() => {}} />
            case 'A':
            case 'W':
                return <SingleChannel id={addr} componentLabel={display} sliderVal={0} onSliderChange={() => {}} />
        }
    }

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
                               this.props.onAliasChange(this.props.fixture);
                           }
                       }}
                />
            </div>
        );
    }
}
