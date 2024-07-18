/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled, { css } from "styled-components"
import React from "react"

export const StyledTileContent = styled.div`
    padding: 10px;
`

export const StyledSafetyTileContent = styled.div<{ $outset?: boolean }>`
    ${props =>
        props.$outset &&
        css`
            margin: -10px;
        `}
    border: 2px solid yellow;
    border-radius: 5px;
    height: 100%;

    .content {
        padding: 10px;
        overflow-y: auto;
        height: 100%;

        .grid {
            display: grid;
            grid-template-columns: 1fr auto auto auto;
            gap: 10px;

            .ant-tag {
                width: 100%;
                text-align: center;
            }
        }

        .safetyTabGrid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px;

            .ant-tag {
                width: 100%;
                text-align: center;
            }
        }
    }
`

export const StyledDivider = styled.div`
    height: 1px; /* Set the height of the divider */
    background-color: lightyellow;
    margin: 5px 0; /* Reset margin */
    padding: 0; /* Reset padding */
`

export const StyledToolTipDiv = styled.div`
    /* Target the outer tooltip wrapper when the tooltip is placed at the top */
    position: relative;
    display: inline-block; // Ensures inline behavior which is crucial for tooltips

    .ant-tooltip-placement-top > .ant-tooltip-content {
        margin-bottom: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-bottom > .ant-tooltip-content {
        margin-top: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-right > .ant-tooltip-content {
        margin-left: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-left > .ant-tooltip-content {
        margin-right: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }
`
