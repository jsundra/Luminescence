import React, { Component } from 'react';
import api from 'api';

export default class Patch extends Component {
	constructor() {
		super();

		this.state = {
			maxAddr: 48,
			overrides: {}
		};

		this.input = {};
		this.slider = {};
	}

	onSetAll(e) {
		e.preventDefault();

	}

	onSetDimmer(addr, level) {
		const overrides = this.state.overrides;
		overrides[addr] = level;
		this.setState({overrides});
		api.setDimmer(addr, level);
	}

	listPatch() {
		const children = [];
		var key = 0;
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
						defaultValue={this.state.overrides[addr] || 0}
						ref={(element) => {this.slider[addr] = element}} 
						onInput={(e) => {
							this.onSetDimmer(addr, this.slider[addr].value);
						}}
					/>
					<span>{this.state.overrides[addr] || 0}</span>
				</div>,
				<button
					key={key++}
					disabled={this.state.overrides[addr] != undefined}
					onClick={(e) => {
						e.preventDefault();
						this.onSetDimmer(addr, this.input[addr].value);
					}}
				>Clear</button>
			);
		}
		return children;
	}

	render() {
		return (
			<div className='patch'>
				<h3>Dimmer</h3>
				<h3>Level</h3>
				<h3>Focus</h3>

				{this.listPatch()}
			</div>

		);
	}
}