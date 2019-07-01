import React from 'react';
import ReactDOM from 'react-dom';
import StatusBar from "components/container/StatusBar.jsx";
import TabGroup from "components/container/TabGroup.jsx";

const page = (
	<div>
		<StatusBar/>
		<hr/>
		<TabGroup/>
	</div>
);

ReactDOM.render(page, document.getElementById('react-root'));