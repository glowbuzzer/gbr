/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled, { css } from "styled-components"

const StyledDockToolbar = styled.div<{ floating: boolean }>`
    ${props =>
        props.floating &&
        css`
            position: absolute;
            top: 0;
            left: 0;
        `}

    font-size: 12px;
    padding: 4px 5px;
    width: 100%;

    div:hover > & {
        visibility: visible;
    }

    border-bottom: 1px solid rgb(227, 227, 227);
`

export const DockToolbar = ({ children, floating = false }) => {
    return <StyledDockToolbar floating={floating}>{children}</StyledDockToolbar>
}

export const DockToolbarButtonGroup = styled.span`
    //margin: 0 4px;

    &:first-child {
        margin-left: 0;
    }

    &:first-child:before,
    :after {
        content: "";
        display: inline-block;
        height: 14px;
        margin: 0 4px;
        border-left: 1px solid rgb(227, 227, 227);
    }

    .anticon {
        display: inline-block;
        margin-right: 3px;

        &:last-child {
            margin-right: 0;
        }
    }
`
