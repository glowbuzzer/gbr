/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { css } from "styled-components"

/**
 * Re-used styles in the dock layout
 */

export const dockDropdownStyle = css`
    line-height: 18px !important;

    .ant-select-selector {
        padding-left: 0 !important;
        //font-size: 12px;
        line-height: 12px !important;
        height: 20px !important;
        border: none !important;
        box-shadow: none !important;

        .anticon {
            font-size: 12px;
            opacity: 0.7;
        }

        .ant-select-selection-item {
            line-height: 14px !important;
        }

        .selected-text {
            display: inline-block;
            transform: translate(0, -2px);
            line-height: 22px;
        }
    }
`
