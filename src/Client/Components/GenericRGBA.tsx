import { Component } from 'react';
import * as React from 'react';

export type Props = {
    address: number;
    alias: string;

    onAliasChange: (address: number, alias: string) => void;
};

export type State = {

};

export default class GenericRGBA extends Component<Props, State> {

    public state: State = {

    };

    public render(): JSX.Element {
        return (
            <div className={'luminescence-multichannel'} onTouchMove={e => e.preventDefault()}>
                <div>{this.props.address}</div>
                <input className="bp3-input .modifier"
                       type='text'
                       dir='auto'
                       defaultValue={this.props.alias}
                       onBlur={e => {
                           const value = e.target.value;
                           if (this.props.alias !== value) {
                               this.props.onAliasChange(this.props.address, value);
                           }
                       }}
                />
            </div>
        );
    }
}
