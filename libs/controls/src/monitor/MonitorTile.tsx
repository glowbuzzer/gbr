/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { useConnectionMonitorReset, useConnectionMonitorStats } from "@glowbuzzer/store"
import { Button, Card, Space } from "antd"

const StyledDiv = styled.div`
    padding: 10px;

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 10px;
    }
`

export const MonitorTile = () => {
    const { heartbeat, status } = useConnectionMonitorStats()
    const reset = useConnectionMonitorReset()

    function normalise_heartbeat(value: number) {
        return (value || 0).toFixed(2)
    }

    function normalise_status(value: number) {
        return (value || 0).toFixed(2)
    }

    return (
        <StyledDiv>
            <Space direction="vertical">
                <Button size="small" onClick={reset}>
                    Reset
                </Button>
                <Card size="small" title="Heartbeat (Value)">
                    <div className="grid">
                        <div>Mean</div>
                        <div>{normalise_heartbeat(heartbeat.mean)}</div>
                        <div>Max</div>
                        <div>{normalise_heartbeat(heartbeat.max)}</div>
                        <div>Min</div>
                        <div>{normalise_heartbeat(heartbeat.min)}</div>
                        <div>Standard Deviation</div>
                        <div>{normalise_heartbeat(heartbeat.std)}</div>
                    </div>
                </Card>
                <Card size="small" title="Status (Wall Time)">
                    <div className="grid">
                        <div>Mean</div>
                        <div>{normalise_status(status.mean)}</div>
                        <div>Max</div>
                        <div>{normalise_status(status.max)}</div>
                        <div>Min</div>
                        <div>{normalise_status(status.min)}</div>
                        <div>Standard Deviation</div>
                        <div>{normalise_status(status.std)}</div>
                    </div>
                </Card>
            </Space>
        </StyledDiv>
    )
}
