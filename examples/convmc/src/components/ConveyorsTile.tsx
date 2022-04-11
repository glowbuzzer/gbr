import { useJoint } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import { MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import React from "react"

export const ConveyorsTile = () => {
    const joints = [useJoint(0), useJoint(1)]

    return (
        <Tile title="Conveyors">
            {[0, 1].map(j => (
                <div key={j} className="motor" style={{ display: "inline-block" }}>
                    <div>
                        <MotorDro width={200} value={joints[j]?.actPos || 0} />
                    </div>
                    <div>
                        <SegmentDisplay value={joints[j]?.actPos || 0} />
                    </div>
                </div>
            ))}
        </Tile>
    )
}
