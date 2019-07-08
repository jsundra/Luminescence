import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ScreenManager from './ScreenManager';
import MessageBus from './MessageBus';
import { ContextInstance } from './RootContext';
import { API } from './API';

const messageBus: MessageBus = new MessageBus();

API.bindMessageBus(messageBus);

const page = (
    <ContextInstance.Provider value={{
        msgBus: messageBus
    }}>
        <ScreenManager/>
    </ContextInstance.Provider>
);

ReactDOM.render(page, document.getElementById('react-root'));
