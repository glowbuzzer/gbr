/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import React from "react"

export const StyledTileContent = styled.div`
    padding: 10px;
`

export const StyledSafetyTileContent = styled.div`
    border: 2px solid yellow;
    border-radius: 5px;
    padding: 10px;
    //background-color: rgba(255, 255, 0, 0.2); /* Light yellow */
`
export const StyledSafetyTileText = styled.div`
    margin-bottom: 1rem;
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
`
