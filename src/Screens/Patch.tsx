import * as React from 'react';
import { Component } from 'react';
import { API } from 'API';

class State {
	maxAddr: number;
	overrides: {[key: number]: number};
	names: {[key: string]: string};
}

export default class Patch extends Component<any, State> {

	private textInput: any;
	private slider: any;

	constructor(props: any) {
		super(props);

		this.state = {
			maxAddr: 48,
			overrides: {},
			names: {}
		};

		this.textInput = {};
		this.slider = {};

		API
			.GetDimmers()
			.then(data => {
				const names = this.state.names;
				for (const key in data) {
					names[key] = data[key].name;
				}
				this.setState({names});
			}, reason => {
				console.error('Error getting dimmer data: ' + reason);
			})
	}

	onSetDimmer(addr: number, level: number): void {
		const overrides = this.state.overrides;
		overrides[addr] = level;
		this.setState({overrides});
		API.SetDimmer(addr, level);
	}

	onNameDimmer(addr: number, name: string): void {
		// TODO: Make this not disgusting
		API.SetDimmer(addr, -1, name);
	}

	listPatch() {
		const children = [];
		let key = 0;
		for (let i = 0; i < this.state.maxAddr; i++) {
			const addr = i + 1;
			children.push(
				<span key={key++}>{addr}</span>,
				<div key={key++}>
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						defaultValue={(this.state.overrides[addr] || 0).toString()}
						ref={(element) => {this.slider[addr] = element}}
						onInput={(e) => {
							this.onSetDimmer(addr, this.slider[addr].value);
						}}
					/>
					<span>{this.state.overrides[addr] || 0}</span>
				</div>,
				<input
                    key={key++}
					type='text'
					defaultValue={this.state.names[addr] || ''}
					ref={(element) => {this.textInput[addr] = element}}
					onBlur={(e) => {
						this.onNameDimmer(addr, this.textInput[addr].value);
					}}
				/>
			);
		}
		return children;
	}

	render() {
		return (
			<div className='patch'>
				<h3>Dimmer</h3>
				<h3>Level</h3>
				<h3>Name</h3>

				{this.listPatch()}
			</div>
		);
	}
}
