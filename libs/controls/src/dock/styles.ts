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
    gap: 10px;
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
