import { HTTP } from './Util/HTTP';
import { DimmerData } from 'Common/BoardData';

export module API {
	export function Status(): Promise<any> {
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
