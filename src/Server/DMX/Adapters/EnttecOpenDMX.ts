import DMXAdapter from './DMXAdapter';

export default class EnttecOpenDMX extends DMXAdapter {

    public static readonly NAME: string = 'Enttec Open DMX USB';
    public static readonly VENDOR_ID: number = 1027;
    public static readonly PRODUCT_ID: number = 24577;

    public sendDMX(dmx: number[]): void {

    }
}
