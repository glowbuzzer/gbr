import * as React from "react"
import { Tile } from "@glowbuzzer/layout"
import { BitFieldDisplay, MotorDro, SegmentDisplay } from "@glowbuzzer/controls"
import { useJoints } from "@glowbuzzer/store"

// you can edit these to display friendly names (lsb order)
const controlLabels = ["ENABLE"]
const statusLabels = ["QUICK STOP"]

export const DrivesTile = () => {
    const joints = useJoints()

    return (
        <Tile title="Drives">
            {joints.map((j, index) => (
                <div key={index} className="motor" style={{ display: "inline-block" }}>
                    <div>
                        <BitFieldDisplay
                            labels={controlLabels}
                            value={j.controlWord}
                            bitCount={16}
                            onChange={value => joints[index].setControlWord(value)}
                        />
                    </div>
                    <div>
                        <BitFieldDisplay labels={statusLabels} value={j.statusWord} bitCount={16} editable={false} />
                    </div>
                    <div>
                        <MotorDro width={200} value={j.actPos} />
                    </div>
                    <div>
                        <SegmentDisplay value={j.actPos} />
                    </div>
                </div>
            ))}
        </Tile>
    )
}
