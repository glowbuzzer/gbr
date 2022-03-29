import * as React from "react"
import { Tile } from "@glowbuzzer/layout"
import { BitFieldDisplay, MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import { useJoint, useJointCount } from "@glowbuzzer/store"

// you can edit these to display friendly names (lsb order)
const controlLabels = ["ENABLE"]
const statusLabels = ["QUICK STOP"]

// TODO: migrate somewhere else
export const DrivesTile = () => {
    const count = useJointCount()

    const DriveItem = ({ index }) => {
        const joint = useJoint(index)

        return (
            <div key={index} className="motor" style={{ display: "inline-block" }}>
                <div>
                    <BitFieldDisplay
                        labels={controlLabels}
                        value={joint.controlWord}
                        bitCount={16}
                        onChange={value => joint.setControlWord(value)}
                    />
                </div>
                <div>
                    <BitFieldDisplay
                        labels={statusLabels}
                        value={joint.statusWord}
                        bitCount={16}
                        editable={false}
                    />
                </div>
                <div>
                    <MotorDro width={200} value={joint.actPos} />
                </div>
                <div>
                    <SegmentDisplay value={joint.actPos} />
                </div>
            </div>
        )
    }

    return (
        <Tile title="Drives">
            {Array.from({ length: count }).map((_, index) => (
                <DriveItem index={index} />
            ))}
        </Tile>
    )
}
