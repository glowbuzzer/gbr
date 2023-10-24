/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"

export const StyledStateIndicator = styled.div<{ negative?: boolean }>`
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    background: ${props => props.theme.colorBorder};
    border-radius: 8px;

    > div {
        flex-grow: 1;
        flex-basis: 0;
        text-align: center;
        margin: 1px;
        padding: 10px;
        border-radius: 8px;
        background: ${props => props.theme.colorPrimaryBg};

        &.active {
            background: ${props =>
                props.negative ? props.theme.colorErrorBorder : props.theme.colorSuccessBorder};
        }
    }
`
