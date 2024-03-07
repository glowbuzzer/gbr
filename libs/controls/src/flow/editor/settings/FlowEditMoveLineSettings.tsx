/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FlowActivityEditParametersProps } from "../../util"
import { FlowEditCartesianPosition } from "../common/FlowEditCartesianPosition"
import { Button, Card, Flex } from "antd"
import { useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { StyledEditTabCardContent, StyledEditTabCardTitle } from "../styles"
import { FlowEditFrameSelectCard } from "../common/FlowEditFrameSelectCard"

export const FlowEditMoveLineSettings = ({ item, onChange }: FlowActivityEditParametersProps) => {
    const { position } = useKinematicsCartesianPosition(0)

    const moveLine = item.moveLine
    const line = moveLine.line

    function update_frame(value: number) {
        return onChange({
            ...item,
            moveLine: {
                ...moveLine,
                line: {
                    ...line,
                    frameIndex: value
                }
            }
        })
    }

    function update_pos_from_current() {
        onChange({
            ...item,
            moveLine: {
                ...moveLine,
                line: {
                    ...line,
                    ...position
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
                        value={line}
                        onChange={position =>
                            onChange({
                                ...item,
                                moveLine: {
                                    ...moveLine,
                                    line: {
                                        ...line,
                                        ...position
                                    }
                                }
                            })
                        }
                    />
                </Card>
                <FlowEditFrameSelectCard frame={line.frameIndex} onChange={update_frame} />
            </Flex>
        </StyledEditTabCardContent>
    )
}
