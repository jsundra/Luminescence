export module ColorUtil {
    export type RGB = { r: number; g: number, b: number };

    export function SliderToHue(sliderVal: number): number {
        return sliderVal * 3.6;
    }

    export function SliderToRGB(sliderVal: number): RGB {
        const hue = SliderToHue(sliderVal);

        return {
            r: Math.max(
                1 - Math.min(1, Math.abs(hue) / 120),
                1 - Math.min(1, Math.abs(hue - 360) / 120)
            ),
            g: 1 - Math.min(1, Math.abs(hue - 120) / 120),
            b: 1 - Math.min(1, Math.abs(hue - 240) / 120)
        }
    }

    export function RGBToHue(color: RGB): number {
        throw new Error('lol I\'m lazy');
    }

    export function RGBToSlider(color: RGB): number {
        return RGBToHue(color) * 3.6;
    }
}