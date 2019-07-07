import { OutboundPayload } from '../PayloadBasee';

export interface StatusPayload extends OutboundPayload {
    adapter: Nullable<string>
}
