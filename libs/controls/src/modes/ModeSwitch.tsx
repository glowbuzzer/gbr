/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { useOperationEnabled } from "../util/hooks"

import styled from "styled-components"
import { useGlowbuzzerMode } from "./GlowbuzzerModeProvider"

const StyledModeLabel = styled.div`
    display: flex;
    align-items: center;

    .auto-icon {
        display: inline-block;
        width: 20px;
        height: 18px;
        line-height: 14px;
        margin: 0 8px 0 0;
        text-align: center;
        border: 2px solid ${props => props.theme.colorBorder};
    }
`

export const ModeSwitch = () => {
    const { modes, mode, setMode } = useGlowbuzzerMode()
    const op = useOperationEnabled()

    if (!Object.keys(modes).length) {
        // no modes, nothing to display
        return null
    }

    const options: DefaultOptionType[] = Object.entries(modes).map(([key, value]) => {
        return {
            key,
            value: key,
            label: (
                <StyledModeLabel>
                    {value.icon ? value.icon : <span className="auto-icon">{value.name[0]}</span>}
                    <span>{value.name}</span>
                </StyledModeLabel>
            ),
            disabled: value.disabled
        }
    })

    function update_mode(value: string) {
        setMode(value)
    }

    return (
        <Select
            disabled={!op}
            options={options}
            value={mode}
            popupMatchSelectWidth={false}
            onChange={update_mode}
        />
    )
}
