import { HTTP } from './util/HTTP';

export type StatusResponse = {
	connection: boolean
};

export type DimmerData = {
	name: string;
}

export module API {
	export function Status(): Promise<StatusResponse> {
		return HTTP.Get('/status');
	}

	export function SetDimmer(addr: number, level: number = -1, name: string = ''): Promise<any> {
		let url = `/dimmer/?addr=${addr}`;

		if (level > -1) {
			url += `&level=${level}`;
		}
		if (name != '') {
			url += `&name=${name}`;
    	}

        return HTTP.Post(url, null);
	}

	export function GetDimmers(): Promise<{[key: string]: DimmerData}> {
		return HTTP.Get('/dimmer/');
	}
}
