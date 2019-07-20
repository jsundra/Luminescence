import { HTTP } from './Util/HTTP';
import { BoardData } from 'Common/BoardData';
import MessageBus from './MessageBus';
import {
    MSG_ASSIGN_FIXTURE,
    MSG_CHANGE_CONTROL,
    MSG_DATA_UPDATE,
    MSG_SET_FIXTURE,
    MSG_UNPARK_DIMMER,
    MSG_UPDATE_DIMMER
} from './Messages';
import {
    AssignFixturePayload, SetControlPayload,
    SetDimmerPayload,
    SetFixturePayload,
    SetParkPayload
} from 'Common/Networking/Payloads/Client';
import { DataUpdate } from '../Common/Networking/Payloads/Server';

export module API {
	export function Status(): Promise<any> {
		return HTTP.Get('/api/status');
	}

	export function GetBoardData(): Promise<BoardData> {
		return HTTP.Get('/api/data');
	}

	export function SetControl(control: string, value: number): Promise<DataUpdate> {
		const payload: SetControlPayload = { [control]: value };
		return HTTP.Post(`/api/controls`, payload);
	}

	export function SetDimmer(addr: number, level: number = -1, name: string = null): Promise<DataUpdate> {
		let url = `/api/dimmer`;

		const payload: SetDimmerPayload = { addr };

		if (level > -1) payload.intensity = level;
        if (name !== null) payload.alias = name;

		return HTTP.Post(url, payload);
	}

	export function UnparkDimmer(addr: number): Promise<DataUpdate> {
		const payload: SetParkPayload = { addr };
		return HTTP.Post(`/api/park`, payload);
	}

	export function AssignFixture(addr: number, type: string): Promise<DataUpdate> {
		const payload: AssignFixturePayload = { addr, type };
		return HTTP.Post(`/api/channel/assign`, payload);
	}

	export function SetFixture(addr: number, intensities: number[] = null, alias: string = null): Promise<DataUpdate> {
		const payload: SetFixturePayload = { addr };

		if (intensities) payload.intensities = intensities;
		if (alias) payload.alias = alias;

		return HTTP.Post(`/api/channel/set`, payload);
	}

	export function bindMessageBus(msgBus: MessageBus): void {
		msgBus.subscribe<MSG_CHANGE_CONTROL>(MSG_CHANGE_CONTROL, msg => {
			SetControl('master', msg.master)
				.then(data => {
					msgBus.dispatch<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data);
				})
				.catch(reason => {
					console.error(`Error setting control (${reason})`);
				}
			);
		});

		msgBus.subscribe<MSG_UPDATE_DIMMER>(MSG_UPDATE_DIMMER, msg => {
			SetDimmer(msg.addr, msg.value, msg.alias)
				.then(data => {
					msgBus.dispatch<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data)
				})
				.catch(reason =>
				console.error(`Error setting dimmer (${reason.toString()})`)
			);
		});

		msgBus.subscribe<MSG_UNPARK_DIMMER>(MSG_UNPARK_DIMMER, msg => {
			UnparkDimmer(msg.addr)
                .then(data => {
                    msgBus.dispatch<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data)
                })
				.catch(reason => console.error(`Error unparking dimmer (${reason.toString()})`));
		});

		msgBus.subscribe<MSG_ASSIGN_FIXTURE>(MSG_ASSIGN_FIXTURE, msg => {
			AssignFixture(msg.addr, msg.desc.name)
                .then(data => {
                    msgBus.dispatch<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data)
                })
				.catch(reason => console.error(`Error assigning fixture (${reason.toString()})`))
		});

		msgBus.subscribe<MSG_SET_FIXTURE>(MSG_SET_FIXTURE, msg => {
			SetFixture(msg.addr, msg.intensities, msg.alias)
                .then(data => {
                    msgBus.dispatch<MSG_DATA_UPDATE>(MSG_DATA_UPDATE, data)
                })
				.catch(reason => console.error(`Error setting fixture values.`));
		});
	}
}
