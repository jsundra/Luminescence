import { HTTP } from './Util/HTTP';
import { BoardData } from 'Common/BoardData';
import MessageBus from './MessageBus';
import { MSG_ASSIGN_FIXTURE, MSG_UNPARK_DIMMER, MSG_UPDATE_DIMMER } from './Messages';
import { AssignFixturePayload, SetDimmerPayload, SetParkPayload } from '../Common/Networking/Payloads/Client';

export module API {
	export function Status(): Promise<any> {
		return HTTP.Get('/status');
	}

	export function GetBoardData(): Promise<BoardData> {
		return HTTP.Get('/data');
	}

	export function SetDimmer(addr: number, level: number = -1, name: string = null): Promise<any> {
		let url = `/dimmer`;

		// TODO: Type check this!
		const payload: SetDimmerPayload = {
			addr: addr
		};

		if (level > -1) payload.intensity = level;
        if (name !== null) payload.alias = name;

		return HTTP.Post(url, payload);
	}

	export function UnparkDimmer(addr: number): Promise<any> {
		const payload: SetParkPayload = { addr };
		return HTTP.Post(`/park`, payload);
	}

	export function AssignFixture(addr: number, type: string): Promise<any> {
		const payload: AssignFixturePayload = { addr, type };
		return HTTP.Post(`/channel/assign`, payload);
	}

	export function bindMessageBus(msgBus: MessageBus): void {
		msgBus.subscribe<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, msg => {
			SetDimmer(msg.addr, msg.value, msg.alias).catch(reason =>
				console.error(`Error setting dimmer (${reason.toString()})`)
			);
		});

		msgBus.subscribe<MSG_UNPARK_DIMMER>(MSG_UNPARK_DIMMER, msg => {
			UnparkDimmer(msg.addr).catch(reason => console.error(`Error unparking dimmer (${reason.toString()})`));
		});

		msgBus.subscribe<MSG_ASSIGN_FIXTURE>(MSG_ASSIGN_FIXTURE, msg => {
			AssignFixture(msg.addr, msg.desc.name).catch(reason => console.error(`Error assigning fixture (${reason.toString()})`))
		});
	}
}
