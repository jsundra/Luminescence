import * as React from 'react';
import { ChannelData } from 'Common/BoardData';
import { Menu, MenuItem, Overlay, Popover } from '@blueprintjs/core';
import { BaseWindow } from './BaseWindow';
import { AllFixtures, FixtureType } from '../../Common/Fixtures/FixtureType';
interface Props {
    channelData: ChannelData;
}

interface State {
    fixtureDialog: boolean;
}

export default class ChannelsWindow extends BaseWindow<Props, State> {

    private addFixture(type: FixtureType): void {

    }

    private listFixtures(): JSX.Element[] {
        const children: JSX.Element[] = [];
        const channelData = this.props.channelData;

        for (const addr in channelData.fixtures) {

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
            /*<Overlay
                className='overlay'
                isOpen={this.state.fixtureDialog}
                onClose={() => this.setState({ fixtureDialog: false })}
                onClosed={(elm) => console.log(elm)}
            >{this.newFixtureDialog()}</Overlay>,*/
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
