/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FlowActivityEditParametersProps } from "../../util"
import { StyledParametersGrid } from "../../styles"
import { FlowEditCartesianPosition } from "../common/FlowEditCartesianPosition"
import { Button, Card, Flex } from "antd"
import { RobotConfigurationSelector } from "../../../misc/RobotConfigurationSelector"
import { useKinematicsCartesianPosition, useKinematicsConfiguration } from "@glowbuzzer/store"
import { StyledEditTabCardContent, StyledEditTabCardTitle } from "../styles"
import { FlowEditTabTitleRadioGroup } from "../common/FlowEditTabTitleRadioGroup"
import { FlowEditFrameSelectCard } from "../common/FlowEditFrameSelectCard"

export const FlowEditMoveToPositionSettings = ({
    item,
    onChange
}: FlowActivityEditParametersProps) => {
    const { supportedConfigurationBits } = useKinematicsConfiguration(0)
    const { configuration, position } = useKinematicsCartesianPosition(0)

    const moveToPosition = item.moveToPosition
    const cartesianPosition = moveToPosition.cartesianPosition

    function update_configuration(value: number) {
        return onChange({
            ...item,
            moveToPosition: {
                ...moveToPosition,
                cartesianPosition: {
                    ...cartesianPosition,
                    configuration: value
                }
            }
        })
    }

    function update_frame(value: number) {
        return onChange({
            ...item,
            moveToPosition: {
                ...moveToPosition,
                cartesianPosition: {
                    ...cartesianPosition,
                    position: {
                        ...cartesianPosition.position,
                        frameIndex: value
                    }
                }
            }
        })
    }

    function update_pos_from_current() {
        onChange({
            ...item,
            moveToPosition: {
                ...moveToPosition,
                cartesianPosition: {
                    ...cartesianPosition,
                    position
                }
            }
        })
    }

    return (
        <StyledEditTabCardContent>
            <Flex vertical gap="small">
                <Card
                    title={
                        <StyledEditTabCardTitle>
                            <div>Target Position</div>
                            <div>
                                <Button size="small" onClick={update_pos_from_current}>
                                    Set From Robot
                                </Button>
                            </div>
                        </StyledEditTabCardTitle>
                    }
                    size="small"
                >
                    <FlowEditCartesianPosition
                        value={cartesianPosition.position}
                        onChange={position =>
                            onChange({
                                ...item,
                                moveToPosition: {
                                    ...moveToPosition,
                                    cartesianPosition: {
                                        ...cartesianPosition,
                                        position
                                    }
                                }
                            })
                        }
                    />
                </Card>
                <Card
                    title={
                        <FlowEditTabTitleRadioGroup
                            title="Robot Configuration"
                            value={cartesianPosition.configuration !== undefined}
                            onChange={value => update_configuration(value ? 0 : undefined)}
                            options={[
                                { value: false, label: "NOT CHANGED" },
                                { value: true, label: "SPECIFIED" }
                            ]}
                        />
                    }
                    size="small"
                >
                    <StyledParametersGrid>
                        {cartesianPosition.configuration === undefined ? (
                            <div>Configuration will continue from previous move</div>
                        ) : (
                            <>
                                <RobotConfigurationSelector
                                    currentValue={configuration}
                                    value={cartesianPosition.configuration}
                                    supportedConfigurationBits={0b111}
                                    onChange={update_configuration}
                                />
                                <Button
                                    size="small"
                                    onClick={() => update_configuration(configuration)}
                                    disabled={configuration === cartesianPosition.configuration}
                                >
                                    Set From Robot
                                </Button>
                            </>
                        )}
                    </StyledParametersGrid>
                </Card>
                <FlowEditFrameSelectCard
                    frame={cartesianPosition.position.frameIndex}
                    onChange={update_frame}
                />
            </Flex>
        </StyledEditTabCardContent>
    )
}
