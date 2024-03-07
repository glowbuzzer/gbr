/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"

export const StyledEditTabCardTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const StyledEditTabCardContent = styled.div`
    .ant-card-body {
        color: ${props => props.theme.colorTextTertiary};
    }
`
