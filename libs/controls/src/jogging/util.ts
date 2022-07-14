/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Space } from "antd"

export const StyledWaypointsDiv = styled.div`
    padding: 10px;

    div {
        font-weight: bold;
        color: darkblue;
        cursor: pointer;

        :hover .delete {
            display: inline;
        }
    }

    .delete {
        display: none;
    }
`

export const StyledJogDiv = styled.div`
    .selectors {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 8px 0 0 0;

        > div {
            //margin-bottom: 5px;
        }

        .frame {
            white-space: nowrap;
        }
    }

    .ant-radio-group {
        text-align: center;
        display: block;
    }

    .tab {
        display: none;
    }

    .tab.selected {
        display: block;
    }
`
/** @ignore */
export const JogTileItem = styled(Space)`
    text-align: center;
    justify-content: center;
    width: 100%;
    padding: 4px 0;
`
