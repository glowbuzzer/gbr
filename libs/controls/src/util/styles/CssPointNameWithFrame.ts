/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { css } from "styled-components"

export const CssPointNameWithFrame = css`
    .point-name,
    .frame-name,
    .workspace-offset-name {
        display: flex;
        gap: 10px;

        .name {
            flex-grow: 1;
            text-overflow: ellipsis;
        }

        svg path {
            fill: ${props => props.theme.colorText};
        }

        .frame,
        .gcode {
            display: inline-block;
            height: 18px;
            margin-top: 2px;
            padding: 0 4px;
            font-size: 12px;
            outline: 1px dashed ${props => props.theme.colorText};
            border-radius: 4px;
            line-height: 1em;
            opacity: 0.8;
            font-weight: normal;
        }

        .gcode {
            padding-top: 2px;
        }
    }
`
