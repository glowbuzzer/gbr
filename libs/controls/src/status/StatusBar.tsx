/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useConnection, useMachine } from "@glowbuzzer/store"
import styled from "styled-components"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { useStatusTrayDismissedItems } from "./StatusTrayProvider"
import { Button, Divider, Flex, Space } from "antd"
import { useHandGuidedMode } from "../handguided/hooks"
import { ReactComponent as HandIcon } from "@material-symbols/svg-400/outlined/pan_tool.svg"
import { ReactComponent as HandIconDisabled } from "@material-symbols/svg-400/outlined/do_not_touch.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { StatusBarGbDb } from "./StatusBarGbDb"
import { StatusBarLiveSwitch } from "./StatusBarLiveSwitch"
import { StatusBarEnableOperation } from "./StatusBarEnableOperation"
import { forwardRef } from "react"
import { StatusBarLayoutControls } from "./StatusBarLayoutControls"
import { ModeSwitch } from "../modes/ModeSwitch"
import { useAutoOpEnabled } from "../app/AutoOpEnabledController"
import { StatusBarConnectAndEmStatus } from "./StatusBarConnectAndEmStatus"

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
    const { connected } = useConnection()
    const { dismissed, undismissAll } = useStatusTrayDismissedItems()
    const { name } = useMachine()
    const { handGuidedModeRequested, handGuidedModeActive } = useHandGuidedMode()
    const enable_button_hidden = useAutoOpEnabled()

    return (
        <Flex justify="space-between" ref={ref}>
            <StyledSpace split={<Divider type="vertical" />}>
                <StatusBarConnectAndEmStatus />
                <ModeSwitch />
                {handGuidedModeRequested && (
                    <Space className={handGuidedModeActive ? "enabled" : "disabled"}>
                        <GlowbuzzerIcon Icon={handGuidedModeActive ? HandIcon : HandIconDisabled} />
                        HAND GUIDED MODE
                    </Space>
                )}
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
            <StatusBarLayoutControls />
        </Flex>
    )
})
