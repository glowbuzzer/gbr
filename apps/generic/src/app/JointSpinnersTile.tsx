import { useJoints } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import { MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
    .dro {
        text-align: right;
        padding: 0 18px;
    }
`

export const JointSpinnersTile = () => {
    const joints = useJoints()

    return (
        <Tile title="Joints">
            <StyledDiv>
                {joints.map((j, index) => (
                    <div key={index} className="motor" style={{ display: "inline-block" }}>
                        <div>
                            <MotorDro width={200} value={j.actPos || 0} />
                        </div>
                        <div className="dro">
                            <SegmentDisplay value={j.actPos || 0} toFixed={3}/>
                        </div>
                    </div>
                ))}
            </StyledDiv>
        </Tile>
    )
}
