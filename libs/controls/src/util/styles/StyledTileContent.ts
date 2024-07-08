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
export const StyledSafetyDigitalInputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const StyledSafetyDigitalInputsRow = styled.div`
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 2fr;
    gap: 10px;
    align-items: center;

    > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .din-label {
        flex-grow: 1;
    }

    .ant-tag {
        //width: 40px;
        text-align: center;
    }

    .ant-select {
        justify-self: center;
        width: 90px; /* Fixed width for Select component */
    }

    .ant-switch {
        justify-self: center;
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
