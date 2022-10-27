/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {css} from "styled-components"

export const CssPointNameWithFrame = css`
    .point-name {
        display: flex;
        gap: 10px;

        .name {
            flex-grow: 1;
            text-overflow: ellipsis;
        }

        .frame {
            display: inline-block;
            height: 18px;
            margin-top: 2px;
            padding: 0 4px;
            font-size: 12px;
            outline: 1px dashed rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            line-height: 1em;
            opacity: 0.8;
        }
    }
`
