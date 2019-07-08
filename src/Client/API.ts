import { HTTP } from './Util/HTTP';
import { BoardData, DimmerData } from 'Common/BoardData';
import MessageBus from './MessageBus';
import { MSG_UPDATE_DIMMER, UPDATE_DIMMER } from './Messages';

export module API {
	export function Status(): Promise<any> {
		return HTTP.Get('/status');
	}

	export function GetBoardData(): Promise<BoardData> {
		return HTTP.Get('/data');
	}

	export function SetDimmer(addr: number, level: number = -1, name: string = ''): Promise<any> {
		let url = `/dimmer`;

		// TODO: Type check this!
		const payload = {
			addr: addr,
			levels: level,
			aliases: name
		};

		return HTTP.Post(url, payload);
	}

	export function bindMessageBus(msgBus: MessageBus): void {
		msgBus.subscribe<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, (msg) => {
			SetDimmer(msg.addr, msg.value, msg.alias).catch(reason =>
				console.error(`Error setting dimmer (${reason.toString()})`)
			);
		});
	}
}
