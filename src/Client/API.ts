import { HTTP } from './Util/HTTP';
import { BoardData } from 'Common/BoardData';
import MessageBus from './MessageBus';
import { ASSIGN_FIXTURE, MSG_UPDATE_DIMMER, UNPARK_DIMMER, UPDATE_DIMMER } from './Messages';
import { AssignFixturePayload, SetDimmerPayload, SetParkPayload } from '../Common/Networking/Payloads/Client';
import { FixtureType } from '../Common/Fixtures/FixtureType';

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

	export function AssignFixture(addr: number, type: FixtureType): Promise<any> {
		const payload: AssignFixturePayload = { addr, type };
		return HTTP.Post(`/channel/assign`, payload);
	}

	export function bindMessageBus(msgBus: MessageBus): void {
		msgBus.subscribe<UPDATE_DIMMER>(MSG_UPDATE_DIMMER, msg => {
			SetDimmer(msg.addr, msg.value, msg.alias).catch(reason =>
				console.error(`Error setting dimmer (${reason.toString()})`)
			);
		});

		msgBus.subscribe<UNPARK_DIMMER>(UNPARK_DIMMER, msg => {
			UnparkDimmer(msg.addr).catch(reason => console.error(`Error unparking dimmer (${reason.toString()}`));
		});

		msgBus.subscribe<ASSIGN_FIXTURE>(ASSIGN_FIXTURE, msg => {

		});
	}
}
