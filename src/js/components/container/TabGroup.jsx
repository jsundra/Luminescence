import React, { Component } from 'react';
import { Tabs, Tab } from 'react-draggable-tab';
import Patch from "components/container/Patch.jsx";

export default class TabGroup extends Component {
	constructor() {
		super();

		this.state = {
			tabs: [
				(<Tab key='tab0' title='Patch' unclosable={true}>
					<Patch/>
				</Tab>)
			]
		}
	}

	render() {
		return (
			<Tabs
				tabsStyles={{marginTop: '5px'}}
				tabs={this.state.tabs}
			/>
		);
	}
}