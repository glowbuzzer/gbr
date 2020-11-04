/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import classnames from 'classnames';

import styles from './styles.module.css';

function Playground({children, theme, transformCode, ...props}) {
    console.log("PLAYGROUND CHILDREN: ", children, props);
    return (
        <LiveProvider
            code={children}
            transformCode={transformCode || (code => `${code};`)}
            theme={theme}
            {...props}>
            <LiveEditor/>
            <div className={styles.playgroundPreview}>
                <LivePreview/>
                <LiveError/>
            </div>
        </LiveProvider>
    );
}

export default Playground;
