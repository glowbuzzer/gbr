import {
    StatusBarEnableOperation,
    StatusBarHandGuidedIndicator,
    StatusBarLayoutControls,
    StatusBarLiveSwitch,
    StatusBarModeSwitch,
    useStatusTrayDismissedItems,
    useAutoOpEnabled
} from "@glowbuzzer/controls"
import { Button, Divider, Flex, Space } from "antd"
import * as React from "react"
import { forwardRef } from "react"
import styled from "styled-components"

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

/**
 * Status bar at the bottom of the screen
 */
export const StatusBar = forwardRef<HTMLDivElement, {}>(({}, ref) => {
    const { dismissed, undismissAll } = useStatusTrayDismissedItems()
    const enable_button_hidden = useAutoOpEnabled()

    return (
        <Flex justify="space-between" ref={ref} className="status-bar" style={{ zIndex: 550 }}>
            <StyledSpace split={<Divider type="vertical" />}>
                <StatusBarLiveSwitch forceEnabled />
                {enable_button_hidden || <StatusBarEnableOperation />}
                {!!dismissed.length && (
                    <div>
                        <Button size="small" type="dashed" onClick={undismissAll}>{`${
                            dismissed.length
                        } hidden notification${dismissed.length > 1 ? "s" : ""}`}</Button>
                    </div>
                )}
            </StyledSpace>
            <StatusBarLayoutControls />
        </Flex>
    )
})
