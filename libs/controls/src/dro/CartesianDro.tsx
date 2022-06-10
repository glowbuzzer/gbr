import * as React from "react"
import { Euler, Quaternion, Vector3 } from "three"
import { FrameSelector } from "../misc"
import { apply_offset, useConfig, useFrames, useKinematics } from "@glowbuzzer/store"
import { DroItem } from "./DroItem"
import { Button, Space } from "antd"

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
    x: "linear",
    y: "linear",
    z: "linear",
    a: "angular",
    b: "angular",
    c: "angular"
}

/**
 * Displays position and orientation given a kinematics configuration index.
 */
export const CartesianDro = (props: CartesianDisplayProps) => {
    const kinematics = useKinematics(0)
    const [frameIndex, setFrameIndex] = React.useState<number>(kinematics.frameIndex)
    const config = useConfig()
    const { convertToFrame } = useFrames()

    const kc = Object.values(config.kinematicsConfiguration)[0]

    const p = convertToFrame(
        kinematics.translation,
        kinematics.rotation,
        kinematics.frameIndex,
        frameIndex
    )

    const { translation, rotation } = apply_offset(p, kinematics.offset, true)

    // this is the local xyz, used to warn when tcp is near/outside of kc limits
    const local_translation = kinematics.translation

    const euler = new Euler().setFromQuaternion(rotation)

    const labels = {
        x: "X",
        y: "Y",
        z: "Z",
        a: "α",
        b: "β",
        c: "Ɣ"
    }

    const pos = {
        x: translation.x,
        y: translation.y,
        z: translation.z,
        a: euler.x,
        b: euler.y,
        c: euler.z
    }

    const extents = {
        x: kc.extentsX,
        y: kc.extentsY,
        z: kc.extentsZ
    }

    const display = props.select ? props.select.split(",").map(s => s.trim()) : Object.keys(pos)

    function zero_dro() {
        kinematics.setOffset(kinematics.translation, new Quaternion().identity())
    }

    function reset_dro() {
        kinematics.setOffset(new Vector3(0, 0, 0), new Quaternion().identity())
    }

    return (
        <div>
            <Space>
                {props.hideFrameSelect || (
                    <div>
                        Frame:{" "}
                        <FrameSelector
                            value={frameIndex}
                            defaultFrame={kinematics.frameIndex}
                            onChange={setFrameIndex}
                        />
                    </div>
                )}
                <div>
                    <Button onClick={zero_dro} size="small">
                        Zero DRO
                    </Button>
                    <Button onClick={reset_dro} size="small">
                        Reset DRO
                    </Button>
                </div>
            </Space>
            {display.map(k => {
                const axis_extents = extents[k]

                function should_warn() {
                    const value = local_translation[k]
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

export enum CartesianDroClipboardOption {
    POSITION,
    POSITION_EULER,
    POSITION_QUATERNION,
    MOVE_LINE,
    MOVE_TO_POSITION
}
