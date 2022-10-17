/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Table } from "antd"

export const StyledTable = styled(Table)`
    white-space: nowrap;

    .ant-table-tbody > tr > td {
        padding: 2px 8px !important;
    }

    .toggle-icon {
        margin-right: 8px;
        font-size: 10px;
    }

    .hidden {
        visibility: hidden;
    }
`
