/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useConnection, useGbdbFacets, useMachine } from "@glowbuzzer/store"
import styled from "styled-components"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { useStatusTrayDismissedItems } from "./StatusTrayProvider"
import { Button, Divider, Flex, Space } from "antd"
import { useHandGuidedMode } from "../handguided/hooks"
import { ReactComponent as HandIcon } from "@material-symbols/svg-400/outlined/pan_tool.svg"
import { ReactComponent as HandIconDisabled } from "@material-symbols/svg-400/outlined/do_not_touch.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { StatusBarGbDb } from "./StatusBarGbDb"

const StyledSpace = styled(Space)`
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

/**
 * Status bar at the bottom of the screen
 */
export const StatusBar = () => {
    const { connected } = useConnection()
    const { dismissed, undismissAll } = useStatusTrayDismissedItems()
    const { name } = useMachine()
    const { keyswitchEngaged, handGuidedModeActive } = useHandGuidedMode()

    return (
        <Flex justify="space-between">
            <StyledSpace split={<Divider type="vertical" />}>
                <Space>
                    <ConnectStatusIndicator connected={connected} />
                    {connected ? <div>{name} CONNECTED</div> : <>NOT CONNECTED</>}
                </Space>
                {keyswitchEngaged && (
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
            </StyledSpace>
            <StatusBarGbDb />
        </Flex>
    )
}
