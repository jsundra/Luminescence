import * as React from 'react';
import { ChannelData } from 'Common/BoardData';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import { BaseProps, BaseWindow } from './BaseWindow';
import { AllFixtureTypes, FixtureDescriptor } from 'Common/Fixtures/Types';
import FixtureComponent from '../Components/FixtureComponent';
import { MSG_ASSIGN_FIXTURE, MSG_SET_FIXTURE } from '../Messages';

interface Props extends BaseProps {
    channelData: ChannelData;
}

interface State {
    fixtureDialog: boolean;
}

export default class ChannelsWindow extends BaseWindow<Props, State> {

    public constructor(props: never) {
        super(props);
    }

    private addFixture(name: string): void {

        let desc: FixtureDescriptor;
        for (const entry of AllFixtureTypes) {
            if (entry.name == name) {
                desc = entry;
                break;
            }
        }
        if (!desc) throw Error(`Trying to add unknown fixture: ${name}`);

        const fixtureKeys = Object.keys(this.props.channelData.fixtures);
        let nextAddr: number = 0;

        if (fixtureKeys.length > 0) {
            const lastFixtureAddr = Number.parseInt(fixtureKeys[fixtureKeys.length - 1]);
            nextAddr = lastFixtureAddr + this.props.channelData.fixtures[lastFixtureAddr].stride;
        }

        this.props.msgBus.dispatch<MSG_ASSIGN_FIXTURE>(MSG_ASSIGN_FIXTURE, {
            addr: nextAddr,
            desc
        });
    }

    private listFixtures(): JSX.Element[] {
        const children: JSX.Element[] = [];
        const channelData = this.props.channelData;

        for (let addr in channelData.fixtures) {
            addr = Number.parseInt(addr); // TODO: Remove this. Loading from JSON, channelData.fixtures is a string.

            const fixture = channelData.fixtures[addr];
            const addrNum = Number.parseInt(addr);

            children.push(<FixtureComponent
                fixture={fixture}
                addr={addr}
                intensities={channelData.values.slice(addrNum, addrNum + fixture.stride)}
                onValueChange={(addr, intensities) => {
                    this.props.msgBus.dispatch<MSG_SET_FIXTURE>(MSG_SET_FIXTURE, {
                        addr,
                        intensities
                    })
                }}
                onAliasChange={(addr, alias) => {
                    this.props.msgBus.dispatch<MSG_SET_FIXTURE>(MSG_SET_FIXTURE, {
                        addr,
                        alias
                    });
                }}
            />)
        }

        return children;
    }

    private showNewButton(): JSX.Element {

        const menuItems = [];
        for (const type of AllFixtureTypes) {
            menuItems.push(<MenuItem text={type.name} />)
        }

        return (
            <Popover
                content={<Menu>{menuItems}</Menu>}
                position={'bottom'}
                onClose={event => this.addFixture((event.target as HTMLInputElement).innerText)}
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
