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
    private _dragActive: boolean;

    public constructor(props: never) {
        super(props);
        this.state = {} as any;
    }

    public render(): JSX.Element[] {
        return ([
            <div>
                <div>Color</div>
                <div
                    className='hue-radial'
                    ref={elm => this._rgbDiv = elm}
                    onPointerDown={e => {
                        this._dragActive = true;
                        this.updateRGB(e.clientX, e.clientY)
                    }}
                    onPointerMove={e => {
                        if (this._dragActive) this.updateRGB(e.clientX, e.clientY);
                    }}
                    onPointerUp={e => {
                        if (this._dragActive) this.updateRGB(e.clientX, e.clientY);
                        this._dragActive = false;
                    }}

                />
            </div>,
            <div style={{width: '100px'}}>
                <Slider
                    label={'Brightness'}
                    min={0}
                    max={1}
                    value={this.state.brightness}
                    direction={Direction.Vertical}
                    onChange={this.updateDimmer.bind(this)}
                />
            </div>
        ]);
    }

    public static getDerivedStateFromProps(props: Props): State {
        let magnitude = Math.sqrt(
            props.color.r * props.color.r
            + props.color.g * props.color.g
            + props.color.b * props.color.b);
        const baseCol = {
            r: props.color.r / magnitude || 0,
            g: props.color.g / magnitude || 0,
            b: props.color.b / magnitude || 0
        };

        if (baseCol.r === 0 && baseCol.g === 0 && baseCol.b === 0) {
            magnitude = 0.01;
        }
        return { baseCol, brightness: magnitude };
    }

    private updateRGB(rawX: number, rawY: number): void {
        const rect = this._rgbDiv.getBoundingClientRect();

        const x = rawX - (rect.left + rect.width / 2);
        const y = rawY - (rect.top + rect.height / 2);

        const theta = 180 - (Math.atan2(x, y) * (180 / Math.PI));

        let r = Math.max(
            Math.max(0, 120 - Math.abs(theta)),
            Math.max(0, 120 - Math.abs(360 - theta))
        ) / 120;
        let g = Math.max(0, 120 - Math.abs(120 - theta)) / 120;
        let b = Math.max(0, 120 - Math.abs(240 - theta)) / 120;

        console.warn(r, g, b);

        const saturation = Math.pow(1 - (Math.sqrt(x * x + y * y) / rect.width * 2), 2);
        const saturationColor: RGB = {
            r: (1 - r) * saturation,
            g: (1 - g) * saturation,
            b: (1 - b) * saturation
        };

        r += saturationColor.r;
        g += saturationColor.g;
        b += saturationColor.b;

        const magnitude = Math.sqrt(r * r + g * g + b * b);
        r /= magnitude;
        g /= magnitude;
        b /= magnitude;

        this.props.onColorChange({
            r: r * this.state.brightness,
            g: g * this.state.brightness,
            b: b * this.state.brightness
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
