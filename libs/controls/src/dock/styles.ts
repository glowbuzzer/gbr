/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled, { css } from "styled-components"

/**
 * Re-used styles in the dock layout
 */

export const dockDropdownStyle = css`
    line-height: 18px !important;

    .ant-select-selector {
        padding-left: 0 !important;
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
            line-height: 22px;
        }
    }
`
export const StyledDockLayout = styled.div`
    padding: 10px;
    display: flex;
    //gap: 10px;
    background: ${props => props.theme.colorBgContainer};
    position: absolute;
    flex-direction: column;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;

    .flexlayout__layout {
        position: relative;
        flex-grow: 1;
        border: 1px solid rgba(128, 128, 128, 0.27);
        --color-text: ${props => props.theme.colorText};
    }

    .flexlayout__tab_button--selected {
        background: none;
        border-bottom: 1px solid ${props => props.theme.colorPrimary};
    }

    .help-popover {
        visibility: hidden;
    }

    .flexlayout__tabset-selected {
        .flexlayout__tab_button--selected {
            background-color: var(--color-tab-selected-background);
            border-bottom: none;
        }

        .help-popover {
            visibility: visible;
        }
    }
`

function gradient(darkMode: boolean) {
    const color1 = darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
    const color2 = darkMode ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.2)"
    return `linear-gradient(
        135deg,
        ${color2} 5%,
        ${color1} 5%,
        ${color1} 50%,
        ${color2} 50%,
        ${color2} 55%,
        ${color1} 55%,
        ${color1} 100%
    )`
}

export const StyledDockTileDimmer = styled.div<{ $darkMode: boolean }>`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => gradient(props.$darkMode)};
    background-size: 6px 6px;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
        padding: 20px 30px;
        border-radius: 10px;
        border: 1px solid ${props => props.theme.colorBorder};
        background: ${props => props.theme.colorBgContainer};
    }
`
