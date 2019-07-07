import Payload from './Payload';

export class SetDimmer implements Payload {
    addr: number;
    levels: number[];
    aliases: string[];
}
