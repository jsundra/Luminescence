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
        let rInfl = color.r / 255;
        let gInfl = color.g / 255;
        let bInfl = color.b / 255;

        if (rInfl > gInfl && rInfl > bInfl) {
            if (gInfl > bInfl) { // Closer to 0
                return gInfl * 120;
            } else { // Closer to 360
                return 360 - bInfl * 120;
            }
        }

        if (gInfl > bInfl && gInfl > rInfl) {
            if (rInfl > bInfl) {
                return gInfl * 120 - rInfl * 60;
            } else {
                return gInfl * 120 + bInfl * 60;
            }
        }

        if (bInfl > rInfl && bInfl > gInfl) {
            if (rInfl > gInfl) {
                return bInfl * 240 + rInfl * 60;
            } else {
                return bInfl * 240 - gInfl * 60;
            }
        }
    }

    export function RGBToSlider(color: RGB): number {
        return RGBToHue(color) / 3.6;
    }
}
