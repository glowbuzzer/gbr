import * as React from "react"
import { Tile, TileEmptyMessage } from "@glowbuzzer/controls"
import { usePrefs, useSoloActivity, useToolIndex, useToolList } from "@glowbuzzer/store"
import { Button, Tag } from "antd"
import styled from "styled-components"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const StyledDiv = styled.div`
    display: flex;
    align-items: center;

    .name {
        flex-grow: 1;
    }
`

export const ToolsTile = () => {
    const tools = useToolList()
    const toolIndex = useToolIndex(0)
    const { fromSI, getUnits } = usePrefs()
    const api = useSoloActivity(0)

    function select(index: number) {
        return api.setToolOffset(index).promise()
    }

    return (
        <Tile title={"Tools"}>
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
