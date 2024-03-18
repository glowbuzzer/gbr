/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"

export const StyledFlowSettingItem = styled.div`
    display: inline-flex;
    width: fit-content;
    border-radius: 0.5em;
    font-size: 0.9em;
    font-weight: bold;
    //text-transform: uppercase;
    border: 1px dashed ${props => props.theme.colorPrimaryBorder};
    background-color: ${props => props.theme.colorPrimaryBg};
    color: ${props => props.theme.colorTextSecondary};
    white-space: nowrap;

    > div {
        padding: 4px 8px 2px 8px;
    }

    > div:not(:last-child) {
        border-right: 1px dashed ${props => props.theme.colorPrimaryBorder};
    }
`

export const StyledParametersGrid = styled.div`
    display: grid;
    grid-gap: 14px;
    grid-template-columns: auto auto auto auto auto 1fr;
`
