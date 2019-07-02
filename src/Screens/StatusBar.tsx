import * as React from 'react';
import { Component } from 'react';

import { API } from 'API';

class State {
	status: string
}

export default class StatusBar extends Component<any, State> {
	constructor(props: any) {
		super(props);

		this.state = {
			status: '...'
		};

		API
			.Status()
			.then((status) => {
				this.setState({
					status: status.connection ? "System ok" : "Adapter offline"
				});
			},
			({ status: number, message: string}) => {
				this.setState({
					status: 'Unknown error'
				});
			});
	}

	render() {
		return (
			<div className='status'>
				<h1>Luminescence</h1>
				<div></div>
				<span>Status: {this.state.status}</span>
			</div>
		);
	}
}
