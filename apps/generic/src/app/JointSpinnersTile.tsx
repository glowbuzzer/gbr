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
                {[0, 1].map(j => (
                    <div key={j} className="motor" style={{ display: "inline-block" }}>
                        <div>
                            <MotorDro width={200} value={joints[j]?.actPos || 0} />
                        </div>
                        <div className="dro">
                            <SegmentDisplay value={joints[j]?.actPos || 0} toFixed={3}/>
                        </div>
                    </div>
                ))}
            </StyledDiv>
        </Tile>
    )
}
