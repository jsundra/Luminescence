import * as React from 'react';
import * as ReactDOM from 'react-dom';
import StatusBar from './Screens/StatusBar';
import ScreenManager from './ScreenManager';

const page = (
  <div>
    <StatusBar/>
  <hr/>
    <ScreenManager/>
  </div>
);

ReactDOM.render(page, document.getElementById('react-root'));
