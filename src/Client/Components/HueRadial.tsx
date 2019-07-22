import * as React from 'react';
import { Component } from 'react';
import Slider, { Direction } from './Slider';
import { ColorUtil } from '../Util/ColorUtil';
import RGB = ColorUtil.RGB;

interface Props {
    color: RGB;
    onColorChange: (col: RGB) => void;
}

interface State {
    baseCol: RGB;
    brightness: number;
}

export default class HueRadial extends Component<Props, State> {

    private _rgbDiv: HTMLDivElement;

    public constructor(props: never) {
        super(props);
        this.state = {} as any;
    }

    public render(): JSX.Element {
        return (
            <div>
                <div
                    className='hue-radial'
                    ref={elm => this._rgbDiv = elm}
                    onPointerDown={e => this.updateRGB(e.clientX, e.clientY)}
                />
                <Slider
                    label={'Brightness'}
                    min={0}
                    max={1}
                    value={this.state.brightness}
                    direction={Direction.Vertical}
                    onChange={this.updateDimmer.bind(this)}
                />
            </div>
        );
    }

    public static getDerivedStateFromProps(props: Props): State {
        const magnitude = Math.sqrt(
            props.color.r * props.color.r
            + props.color.g * props.color.g
            + props.color.b * props.color.b);
        const baseCol = {
            r: props.color.r / magnitude * 255 || 1,
            g: props.color.g / magnitude * 255 || 1,
            b: props.color.b / magnitude * 255 || 1
        };
        const brightness = baseCol.r / props.color.r;
        console.log(baseCol.r, props.color.r);
        return { baseCol, brightness };
    }

    private updateRGB(rawX: number, rawY: number): void {
        const rect = this._rgbDiv.getBoundingClientRect();

        const x = rawX - (rect.left + rect.width / 2);
        const y = rawY - (rect.top + rect.height / 2);
        const saturation = 1; //Math.sqrt(x * x + y * y) / rect.width;

        this.props.onColorChange({
            r: 255 * saturation,
            g: 0 * saturation,
            b: 0 * saturation
        });
    }

    private updateDimmer(dim: number): void {
        this.setState({ brightness: dim });
        this.props.onColorChange({
            r: this.state.baseCol.r * dim,
            g: this.state.baseCol.g * dim,
            b: this.state.baseCol.b * dim
        });
    }
}
