import * as React from 'react';
import { Component } from 'react';

interface Props {
    min: number;
    max: number;
    value: number;
    step?: number;

    label?: string;

    width?: number | string;
    height?: number | string;
    direction?: Direction;

    onChange?: (val: number) => void;
    onChangeFinal?: (val: number) => void;
}

interface State {
    width: number | string;
    height: number | string;
    step: number;

    onChange?: (val: number) => void;
    onChangeFinal?: (val: number) => void;


}

export enum Direction { Horizontal, Vertical }

export default class Slider extends Component<Props, State> {

    private element: HTMLInputElement;

    public constructor(props: never) {
        super(props);

        this.state = {} as any;
    }


    public static getDerivedStateFromProps(props: Props): State {
        return {
            width: props.width || 10,
            height: props.height || '100%',
            step: props.step || (props.max - props.min) / 100,

            onChange: props.onChange,
            onChangeFinal: props.onChangeFinal
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.props.label && <div style={{width: '80%', margin: 'auto'}}>{this.props.label}</div>}
                <input
                    className={'slider' + (this.props.direction === Direction.Vertical ? ' vertical' : '')}
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value || 0}
                    step={this.state.step}

                    width={this.state.width}
                    height={this.state.height}

                    ref={elm => this.element = elm}
                    onChange={() => {
                        this.state.onChange && this.state.onChange(Number.parseFloat(this.element.value));
                    }}
                    onPointerUp={() => {
                        this.state.onChangeFinal && this.state.onChangeFinal(Number.parseFloat(this.element.value))
                    }}
                />
            </div>
        );
    }
}
