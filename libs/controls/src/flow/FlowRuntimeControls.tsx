/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Space, Tag } from "antd"
import { CaretRightOutlined, PauseOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"
import { FlowState } from "./runtime/types"
import { useFlowContext } from "./FlowContextProvider"

export const FlowRuntimeControls = () => {
    const { state, start, stop, reset, pause } = useFlowContext()

    return (
        <Space>
            <Button.Group size="small">
                <Button
                    disabled={!(start || reset)}
                    onClick={() => {
                        const action = reset || start
                        action()
                    }}
                >
                    {reset ? <ReloadOutlined /> : <CaretRightOutlined />}
                </Button>
                <Button disabled={!pause} onClick={pause}>
                    <PauseOutlined />
                </Button>
                <Button disabled={!stop} onClick={stop}>
                    <StopIcon />
                </Button>
            </Button.Group>
            <Tag>{FlowState[state]}</Tag>
        </Space>
    )
}
