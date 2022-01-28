import * as React from "react"
import { FrameSelector } from "../misc"
import { useConfig, useKinematics, useTcp } from "@glowbuzzer/store"
import { DroItem } from "./DroItem"
import { Euler } from "three"
import { Tile } from "@glowbuzzer/layout"

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

    /**
     * Optional threshold to warn when position is nearing the machine extents (limits).
     * A number between zero and 1 representing the fraction of the overall range of travel within which a warning will be displayed.
     */
    warningThreshold?: number
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
    const config = useConfig()

    const kc = Object.values(config.kinematicsConfiguration)[0]
    const params = kc?.kinematicsParameters

    const { position, orientation } = kinematics.pose
    const { position: local_position } = useTcp(0, "world")

    const euler = new Euler().setFromQuaternion(orientation)

    const labels = {
        x: "X",
        y: "Y",
        z: "Z",
        a: "α",
        b: "β",
        c: "Ɣ"
    }

    const pos = {
        x: position.x,
        y: position.y,
        z: position.z,
        a: euler.x,
        b: euler.y,
        c: euler.z
    }

    const extents = {
        x: params?.xExtents,
        y: params?.yExtents,
        z: params?.zExtents
    }

    const display = props.select ? props.select.split(",").map(s => s.trim()) : Object.keys(pos)

    return (
        <div>
            {props.hideFrameSelect || (
                <div>
                    Frame:{" "}
                    <FrameSelector defaultFrame={kinematics.frameIndex} onChange={setFrameIndex} />
                </div>
            )}
            {display.map(k => {
                const axis_extents = extents[k]

                function should_warn() {
                    const value = local_position[k]
                    if (axis_extents) {
                        const [min, max] = axis_extents
                        const tolerance = (max - min) * props.warningThreshold
                        return value < min + tolerance || value > max - tolerance
                    }
                }

                return (
                    <DroItem
                        key={k}
                        label={labels[k]}
                        value={pos[k]}
                        type={types[k]}
                        error={should_warn()}
                    />
                )
            })}
        </div>
    )
}

export const CartesianDroTile = () => {
    return (
        <Tile title="Cartesian DRO">
            <CartesianDro kinematicsConfigurationIndex={0} warningThreshold={0.05} />
        </Tile>
    )
}
