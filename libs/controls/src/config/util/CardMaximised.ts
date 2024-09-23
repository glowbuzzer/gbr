/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Card } from "antd"

export const CardMaximised = styled(Card)`
    display: flex;
    height: 100%;
    flex-direction: column;
    background: inherit;

    > .ant-card-body {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1px 0;
    }
`
