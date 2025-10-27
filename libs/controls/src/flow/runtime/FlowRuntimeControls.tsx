/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Space } from "antd"
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons"
import { StopIcon } from "../../util/StopIcon"
import { useFlowContext } from "../FlowContextProvider"

export const FlowRuntimeControls = () => {
    const { start, stop, pause } = useFlowContext()

    return (
        <Space>
            <Space.Compact>
                <Button disabled={!start} onClick={start} icon={<CaretRightOutlined />}>
                    Start
                </Button>
                <Button disabled={!pause} onClick={pause} icon={<PauseOutlined />}>
                    Pause
                </Button>
                <Button disabled={!stop} onClick={stop} icon={<StopIcon />}>
                    Stop
                </Button>
            </Space.Compact>
            {/*
            {state === FlowState.ACTIVE && <Tag>{FlowState[state]}</Tag>}
*/}
        </Space>
    )
}
