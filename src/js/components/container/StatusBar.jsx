import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import api from 'api';

class StatusBar extends Component {
	constructor() {
		super();

		this.state = {
			status: '...'
		};

		api
			.status()
			.then((status) => {
				this.setState({
					status: status.connection ? "System ok" : "Adapter offline"
				});
			},
			(status, message) => {
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

export default StatusBar;