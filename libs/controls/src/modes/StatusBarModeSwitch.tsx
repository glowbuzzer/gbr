/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { useOperationEnabled } from "../util"

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

export const StatusBarModeSwitch = () => {
    const { modes, mode, setMode } = useGlowbuzzerMode()
    const op = useOperationEnabled()

    if (!modes.length) {
        // no modes, nothing to display
        return null
    }

    const options: DefaultOptionType[] = modes.map(({ disabled, icon, name, value }) => {
        return {
            key: value,
            value: value,
            label: (
                <StyledModeLabel>
                    {icon ? icon : <span className="auto-icon">{name[0]}</span>}
                    <span>{name}</span>
                </StyledModeLabel>
            ),
            disabled: disabled
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
