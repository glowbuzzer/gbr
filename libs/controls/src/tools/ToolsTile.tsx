/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { TileEmptyMessage } from "@glowbuzzer/controls"
import {
    MachineState,
    useMachine,
    usePrefs,
    useSoloActivity,
    useToolIndex,
    useToolList
} from "@glowbuzzer/store"
import { Button, Tag } from "antd"
import styled from "styled-components"
import { RightOutlined } from "@ant-design/icons"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const StyledDiv = styled.div`
    display: flex;
    align-items: center;

    .name {
        flex-grow: 1;
    }
`

/**
 * The tools tile shows all tools in the configuration and allows you to switch tools.
 *
 * It is your responsibility to ensure the machine is at rest when the tool is changed.
 * For tool changes when running a job (for example, during G-code execution), see the section on automated tool changes.
 */
export const ToolsTile = () => {
    const tools = useToolList()
    const toolIndex = useToolIndex(0)
    const { fromSI, getUnits } = usePrefs()
    const api = useSoloActivity(0)
    const { currentState } = useMachine()

    function select(index: number) {
        return api.setToolOffset(index).promise()
    }

    return (
        <StyledTileContent>
            {tools?.map((config, index) => (
                <StyledDiv key={index}>
                    <div className="name">{config.name}</div>
                    {index === toolIndex && <RightOutlined />}
                    <Tag>
                        {fromSI(config.translation?.z || 0, "linear").toFixed(2)}{" "}
                        {getUnits("linear")}
                    </Tag>
                    {config.diameter && (
                        <Tag>
                            <svg viewBox="0 0 16 16" width={16}>
                                <circle
                                    cx={6}
                                    cy={10}
                                    r={5}
                                    stroke="black"
                                    fill="none"
                                    strokeWidth={1}
                                />
                            </svg>
                            {fromSI(config.diameter || 0, "linear").toFixed(2)} {getUnits("linear")}
                        </Tag>
                    )}
                    <Button
                        size="small"
                        onClick={() => select(index)}
                        disabled={currentState !== MachineState.OPERATION_ENABLED}
                    >
                        Select
                    </Button>
                </StyledDiv>
            ))}
            {!tools?.length && <TileEmptyMessage>No tools configured</TileEmptyMessage>}
        </StyledTileContent>
    )
}
