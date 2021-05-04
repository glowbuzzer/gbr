import * as React from "react"
import { FrameSelector } from "../misc/FrameSelector"
import { useKinematics } from "@glowbuzzer/store"
import * as THREE from "three"
import { DroItem } from "./DroItem"

type CartesianDisplayProps = {
    /**
     * The index of the kinematics configuration in the current configuration.
     */
    kinematicsConfigurationIndex: number

    /**
     * Hide frame selection control. If `true`, values will be displayed in local coordinates.
     */
    hideFrameSelect?: boolean

    /**
     * Optional comma-separated list of axes to display
     */
    select?: string
}

const types = {
    x: "scalar",
    y: "scalar",
    z: "scalar",
    a: "angular",
    b: "angular",
    c: "angular"
}

export const CartesianDro = (props: CartesianDisplayProps) => {
    const [frameIndex, setFrameIndex] = React.useState<number>(0)
    const kinematics = useKinematics(0, frameIndex)

    const { position, orientation } = kinematics.pose

    const euler = new THREE.Euler().setFromQuaternion(orientation)

    const pos = {
        x: position.x,
        y: position.y,
        z: position.z,
        a: euler.x,
        b: euler.y,
        c: euler.z
    }

    const display = props.select ? props.select.split(",").map(s => s.trim()) : Object.keys(pos)

    console.log("FRAME INDEX", frameIndex)

    return (
        <div>
            {props.hideFrameSelect || (
                <div>
                    Frame: <FrameSelector defaultFrame={kinematics.frameIndex} onChange={setFrameIndex} />
                </div>
            )}
            {display.map(k => (
                <DroItem key={k} label={k} value={pos[k]} type={types[k]} />
            ))}
        </div>
    )
}
