/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useJoint, useJointCount } from "@glowbuzzer/store"
import { DockTileDefinitionBuilder, MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import React from "react"
import styled from "styled-components"

export const StyledPanel = styled.div`
    padding: 10px;
`

const JointSpinnersTileHelp = () => (
    <div>
        <h4>JointSpinners Tile</h4>
        <p>
            The Joint Spinners tile shows all joints configured with a graphical representation of
            their position.
        </p>
    </div>
)

const StyledDiv = styled.div`
    .dro {
        text-align: right;
        padding: 0 18px;
    }
`

const JointSpinnerItem = ({ index }) => {
    const j = useJoint(index)

    return (
        <div key={index} className="motor" style={{ display: "inline-block" }}>
            <div>
                <MotorDro width={200} value={j.actPos || 0} />
            </div>
            <div className="dro">
                <SegmentDisplay value={j.actPos || 0} toFixed={3} />
            </div>
        </div>
    )
}

const JointSpinnersTile = () => {
    const count = useJointCount()

    return (
        <StyledPanel>
            <StyledDiv>
                {Array.from({ length: count }).map((_, index) => (
                    <JointSpinnerItem key={index} index={index} />
                ))}
            </StyledDiv>
        </StyledPanel>
    )
}

export const JointSpinnersTileDefinition = DockTileDefinitionBuilder()
    .id("joint-spinners")
    .name("Joint Spinners")
    .placement(1, 1)
    .render(JointSpinnersTile, JointSpinnersTileHelp)
    .build()
