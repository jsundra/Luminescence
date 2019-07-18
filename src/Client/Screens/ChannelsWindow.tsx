import * as React from 'react';
import { ChannelData } from 'Common/BoardData';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import { BaseWindow } from './BaseWindow';
import { AllFixtures, FixtureType } from 'Common/Fixtures/FixtureType';
import { SingleChannel } from '../Components/SingleChannel';
import { MSG_ASSIGN_FIXTURE } from "src/Client/Messages";
interface Props {
    channelData: ChannelData;
}

interface State {
    fixtureDialog: boolean;
}

export default class ChannelsWindow extends BaseWindow<Props, State> {

    private addFixture(type: FixtureType): void {
        // this.context.msgBus.dispatch<MSG_ASSIGN_FIXTURE>(MSG_ASSIGN_FIXTURE, {
        //     addr:
        // })
    }

    private listFixtures(): JSX.Element[] {
        const children: JSX.Element[] = [];
        const channelData = this.props.channelData;

        for (const addr in channelData.fixtures) {
            const fixture = channelData.fixtures[addr];
            switch (fixture.type) {
                case 'Single Dimmer':
                    children.push(<SingleChannel
                        key={addr}
                        // @ts-ignore
                        id={addr}
                        sliderVal={}
                        onSliderChange={}
                        onNameChange={}
                    />);
            }
        }

        return children;
    }

    private showNewButton(): JSX.Element {

        const menuItems = [];
        for (const type of AllFixtures) {
            menuItems.push(<MenuItem text={type} />)
        }

        return (
            <Popover
                content={<Menu>{menuItems}</Menu>}
                position={'bottom'}
                onClose={event => this.addFixture((event.target as HTMLInputElement).innerText as FixtureType)}
            >
                <div className='luminescence-controlgroup clickable'

                >
                    <span className='btn-icon'>+</span>
                </div>
            </Popover>
        );
    }

    public render() {
        return ([
            <div className='flex-parent'>
                <div className='flex'
                     onClick={e => e.preventDefault()}
                >
                    {this.listFixtures()}
                    {this.showNewButton()}
                </div>
            </div>
        ]);
    }
}
