import { useJoint, useJointCount } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/controls"
import { MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import React from "react"
import styled from "styled-components"

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

export const JointSpinnersTile = () => {
    const count = useJointCount()

    return (
        <Tile title="Joints">
            <StyledDiv>
                {Array.from({ length: count }).map((_, index) => (
                    <JointSpinnerItem key={index} index={index} />
                ))}
            </StyledDiv>
        </Tile>
    )
}
