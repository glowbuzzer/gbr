/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { forwardRef } from "react"
import styled from "styled-components"
import { useStatusTrayDismissedItems } from "./StatusTrayProvider"
import { Button, Divider, Flex, Space } from "antd"
import { StatusBarGbDb } from "./StatusBarGbDb"
import { StatusBarLiveSwitch } from "./StatusBarLiveSwitch"
import { StatusBarEnableOperation } from "./StatusBarEnableOperation"
import { StatusBarLayoutControls } from "./StatusBarLayoutControls"
import { StatusBarModeSwitch } from "../modes/StatusBarModeSwitch"
import { useAutoOpEnabled } from "../app/AutoDesiredModeController"
import { StatusBarConnectAndEmStatus } from "./StatusBarConnectAndEmStatus"
import { StatusBarHandGuidedIndicator } from "./StatusBarHandGuidedIndicator"
import { StatusBarUser } from "../usermgmt/StatusBarUser"

const StyledSpace = styled(Space)`
    padding-top: 8px;
    font-size: 0.8em;
    font-weight: bold;

    .ant-space.enabled {
        color: ${props => props.theme.green5};

        path {
            fill: ${props => props.theme.green5};
            stroke: ${props => props.theme.green5};
        }
    }

    .ant-space.disabled {
        color: ${props => props.theme.red5};

        path {
            fill: ${props => props.theme.red5};
            stroke: ${props => props.theme.red5};
        }
    }
`

type StatusBarProps = {
    children: React.ReactNode
}

/**
 * Status bar at the bottom of the screen
 */
export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(({ children }, ref) => {
    const { dismissed, undismissAll } = useStatusTrayDismissedItems()
    const enable_button_hidden = useAutoOpEnabled()

    return (
        <Flex justify="space-between" ref={ref} className="status-bar" style={{ zIndex: 550 }}>
            <StyledSpace split={<Divider type="vertical" />}>
                <StatusBarConnectAndEmStatus />
                <StatusBarModeSwitch />
                <StatusBarHandGuidedIndicator />
                {!!dismissed.length && (
                    <div>
                        <Button size="small" type="dashed" onClick={undismissAll}>{`${
                            dismissed.length
                        } hidden notification${dismissed.length > 1 ? "s" : ""}`}</Button>
                    </div>
                )}
                <StatusBarLiveSwitch />
                {enable_button_hidden || <StatusBarEnableOperation />}
            </StyledSpace>
            {children}
            <StatusBarGbDb />
            <StatusBarUser />
            <StatusBarLayoutControls />
        </Flex>
    )
})
