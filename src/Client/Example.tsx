import * as React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';

export type ViewId = 'a' | 'b' | 'c' | 'new';

const TITLE_MAP: Record<ViewId, string> = {
    a: 'Left Window',
    b: 'Top Right Window',
    c: 'Bottom Right Window',
    new: 'New Window',
};

export class Example extends React.PureComponent<{}, {}> {

    render() {
        return (
            <div>
                <Mosaic<ViewId>
                    renderTile={(id, path) => (
                        <MosaicWindow<ViewId> path={path} createNode={() => 'new'} title={TITLE_MAP[id]}>
                            <h1>{TITLE_MAP[id]}</h1>
                        </MosaicWindow>
                    )}
                    initialValue={{
                        direction: 'row',
                        first: 'a',
                        second: {
                            direction: 'column',
                            first: 'b',
                            second: 'c',
                        },
                    }}
                    className={'mosaic-blueprint-theme bp3-dark'}
                />
            </div>
        );
    }

}
