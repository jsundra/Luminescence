import Payload from './Payload';

export class SetDimmer implements Payload {
    addr: number;
    level: number[];
    alias: string[];
}
