/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { PositionMode } from "./JogGotoCartesian"
import styled from "styled-components"
import { useConnection, usePreview, useSoloActivity } from "@glowbuzzer/store"
import { JogTouchWidget, JogTouchWidgetMode } from "../JogTouchWidget"

const StyledDiv = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    gap: 30px;
    //text-align: center;

    svg {
        display: inline-block;
    }
`

type JogTouchCartesianProps = {
    positionMode: PositionMode
    lockXy: boolean
    lockSpeed: boolean
    kinematicsConfigurationIndex: number
    frameIndex: number
    disabled: boolean
}

export const JogTouchCartesian = ({
    kinematicsConfigurationIndex,
    positionMode,
    lockXy,
    lockSpeed
}: JogTouchCartesianProps) => {
    const preview = usePreview()
    const motion = useSoloActivity(kinematicsConfigurationIndex)
    const { connected } = useConnection()

    async function jog_xy_start(vx: number, vy: number) {
        if (connected) {
            preview.disable()
            if (positionMode === PositionMode.POSITION) {
                await motion.moveVectorAtVelocity(vx, vy, 0).promise()
            } else {
                await motion.moveRotationAtVelocity(vx, vy, 0).promise()
            }
            preview.enable()
        }
    }

    async function jog_z_start(_vx: number, vy: number) {
        if (connected) {
            preview.disable()
            if (positionMode === PositionMode.POSITION) {
                await motion.moveVectorAtVelocity(0, 0, vy).promise()
            } else {
                await motion.moveRotationAtVelocity(0, 0, vy).promise()
            }
            preview.enable()
        }
    }

    function jog_end() {
        if (connected) {
            return motion.cancel().promise()
        }
    }

    return (
        <StyledDiv>
            <JogTouchWidget
                mode={JogTouchWidgetMode.XY}
                lockXy={lockXy}
                lockSpeed={lockSpeed}
                onJogStart={jog_xy_start}
                onJogEnd={jog_end}
            />
            <JogTouchWidget
                mode={JogTouchWidgetMode.VERTICAL}
                lockXy={lockXy}
                lockSpeed={lockSpeed}
                onJogStart={jog_z_start}
                onJogEnd={jog_end}
            />
        </StyledDiv>
    )
}