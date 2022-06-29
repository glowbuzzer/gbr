/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tile, TileEmptyMessage } from "@glowbuzzer/controls"
import { usePrefs, useSoloActivity, useToolIndex, useToolList } from "@glowbuzzer/store"
import { Button, Tag } from "antd"
import styled from "styled-components"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"


const help = (
    <div>
        <h4>Tools Tile</h4>
        <p>The Tools Tile shows the tools that have been configured in the tools section of the JSON config file.</p>
        <p>It allows a user to manually select a tool.</p>
        <p>The machine must be in the <code>OPERATION_ENABLED</code> state to perform a tool change.</p>
        <p>The Toolpath Display will show a change of position when tools of different lengths are selected.</p>
    </div>
)


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

    function select(index: number) {
        return api.setToolOffset(index).promise()
    }

    return (
        <Tile title={"Tools"} help={help}>
            {Object.entries(tools).map(([name, config], index) => (
                <StyledDiv key={name}>
                    <div className="name">{name}</div>
                    {index === toolIndex && <RightOutlined />}
                    <Tag>
                        {fromSI(config.translation?.z || 0, "linear")} {getUnits("linear")}
                    </Tag>
                    <Button size="small" onClick={() => select(index)}>
                        Select
                    </Button>
                </StyledDiv>
            ))}
            {Object.keys(tools).length === 0 && (
                <TileEmptyMessage>No tools configured</TileEmptyMessage>
            )}
        </Tile>
    )
}
