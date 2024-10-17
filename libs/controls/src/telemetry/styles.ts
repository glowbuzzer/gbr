/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Tag } from "antd"

export const StyledChartsContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; // othewise svg will grow indefinitely

    path {
        stroke-width: 1;
        fill: none;
    }

    .main {
        width: 100%;
        flex-grow: 1;

        .x.axis {
            transform: translate(0, calc(100% - 30px));
        }

        .y.axis {
            transform: translate(calc(100% - 30px), 0);
        }
    }

    .brush {
        height: 100px;
        width: calc(100% - 30px);
        //background: rgba(255, 255, 255, 0.05);

        path {
            opacity: 0.5;
            user-select: none;
        }
    }

    rect.selection {
        //fill: none;
        stroke: none;
    }

    rect.handle {
        fill: none;
        stroke: none;
    }
`

export const StyledAxisToggle = styled(Tag)<{ axiscolor: string; selected: boolean }>`
    cursor: pointer;

    span {
        display: block;
        min-width: 18px;
        margin-bottom: 3px;
        text-align: center;
        border-bottom: 2px solid ${props => (props.selected ? props.axiscolor : "transparent")};
    }
`

export const StyledTelemetryForKinematicsConfiguration = styled.div`
    user-select: none;
    padding: 10px;
    height: 100%;
    margin-bottom: 4px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .controls {
        display: flex;
        gap: 5px;

        align-items: center;

        .title {
            flex-grow: 1;
            text-align: right;
        }

        .ant-tag:hover {
            outline: 1px solid grey;
        }
    }
`
