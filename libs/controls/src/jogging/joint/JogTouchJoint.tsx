/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useJointsForKinematicsConfigurationList, useMotionAllowed } from "../../util/hooks"
import { JogTouchWidget, JogTouchWidgetMode } from "../JogTouchWidget"
import { LIMITPROFILE, usePreview, useSoloActivity } from "@glowbuzzer/store"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    .controls {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 10px;
        align-items: center;
        margin: 10px 0;

        .joint-number {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;
            border: 1px solid ${props => props.theme.colorPrimaryBg};
            background: ${props => props.theme.colorPrimaryBg};
            border-radius: 8px;
        }
    }
`

type JogTouchJointProps = {
    kinematicsConfigurationIndex: number
}

export const JogTouchJoint = ({ kinematicsConfigurationIndex }: JogTouchJointProps) => {
    const joints = useJointsForKinematicsConfigurationList(kinematicsConfigurationIndex)
    const enabled = useMotionAllowed()

    return (
        <StyledDiv>
            <div className="controls">
                {joints.map((_joint, index) => {
                    const preview = usePreview()
                    const motion = useSoloActivity(kinematicsConfigurationIndex)

                    async function jog_start(vx: number) {
                        const velos = joints.map(({ config }, logical_index) => {
                            const vmax =
                                config.limits[LIMITPROFILE.LIMITPROFILE_JOGGING]?.vmax ||
                                config.limits[LIMITPROFILE.LIMITPROFILE_DEFAULT].vmax

                            return logical_index === index ? vmax * vx : 0
                        })
                        preview.disable()
                        try {
                            return await motion.moveJointsAtVelocity(velos).promise()
                        } finally {
                            preview.enable()
                        }
                    }

                    function jog_end() {
                        return motion.cancel().promise()
                    }

                    return (
                        <React.Fragment key={index}>
                            <div className="joint-number">{index}</div>
                            <JogTouchWidget
                                mode={JogTouchWidgetMode.HORIZONTAL}
                                lockSpeed={false}
                                onJogStart={jog_start}
                                onJogEnd={jog_end}
                                disabled={!enabled}
                            />
                        </React.Fragment>
                    )
                })}
            </div>
        </StyledDiv>
    )
}
