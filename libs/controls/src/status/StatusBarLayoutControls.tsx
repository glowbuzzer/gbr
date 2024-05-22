/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { TableOutlined } from "@ant-design/icons"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { is_touch_device } from "../dock/util"
import { useDockLayoutContext } from "../dock"

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
`

const touch = is_touch_device()

export const StatusBarLayoutControls = () => {
    const { locked, setLocked } = useDockLayoutContext()

    if (!touch) {
        return null
    }

    return (
        <StyledDiv>
            <GlowbuzzerIcon
                Icon={TableOutlined}
                button
                checked={!locked}
                onClick={() => setLocked(!locked)}
            />
        </StyledDiv>
    )
}
