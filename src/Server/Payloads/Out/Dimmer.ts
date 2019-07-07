import { OutboundPayload } from '../PayloadBasee';

export default interface DimmerPayload extends OutboundPayload {
    [key: number]: {
        name: string,
        level: number
    }
}
