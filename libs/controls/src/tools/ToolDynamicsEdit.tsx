/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ToolConfig } from "@glowbuzzer/store"
import styled from "styled-components"
import { PrecisionInput } from "@glowbuzzer/controls"

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);

    > div {
        display: flex;
        gap: 4px;
    }
`

type ToolDynamicsEditProps = {
    item: ToolConfig["rigidBodyInertia"]
    onChange: (item: ToolConfig["rigidBodyInertia"]) => void
}

export const ToolDynamicsEdit = ({ item, onChange }: ToolDynamicsEditProps) => {
    return (
        <StyledDiv>
            <div>
                <span>Mass</span>
                <PrecisionInput value={item.m || 0} precision={2} />g
            </div>
            <div>
                <span>CoM</span>
            </div>
        </StyledDiv>
    )
}
