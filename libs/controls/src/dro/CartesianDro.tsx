import * as React from "react"
import { Euler, Quaternion, Vector3 } from "three"
import { FrameSelector } from "../misc"
import {
    apply_offset,
    MoveLineBuilder,
    useConfig,
    useFrames,
    useKinematics,
    useKinematicsCartesianPosition
} from "@glowbuzzer/store"
import { DroItem } from "./DroItem"
import { Tile } from "../tiles"
import { message, Button, Dropdown, Menu, Space } from "antd"
import { CopyOutlined } from "@ant-design/icons"
import { useLocalStorage } from "../util/LocalStorageHook"

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

const CLIPBOARD_MODE_TITLES = {
    [CartesianDroClipboardOption.POSITION]: "Position",
    [CartesianDroClipboardOption.POSITION_EULER]: "Position + Euler",
    [CartesianDroClipboardOption.POSITION_QUATERNION]: "Position + Quaternion",
    [CartesianDroClipboardOption.MOVE_LINE]: "MoveLine API",
    [CartesianDroClipboardOption.MOVE_TO_POSITION]: "MoveToPosition API"
}

type CartesianDroTileProps = {
    kinematicsConfigurationIndex?: number
    clipboardMode?: true | false | CartesianDroClipboardOption
}

export const CartesianDroTile = ({
    kinematicsConfigurationIndex: kcIndexMayBeUndefined,
    clipboardMode
}: CartesianDroTileProps) => {
    const kinematicsConfigurationIndex = kcIndexMayBeUndefined || 0

    const position = useKinematicsCartesianPosition(kinematicsConfigurationIndex)

    const [selectedOption, setSelectedOption] = useLocalStorage<CartesianDroClipboardOption>(
        `dro.clipboard.mode.${kinematicsConfigurationIndex}`,
        CartesianDroClipboardOption.POSITION
    )

    function set_clipboard(text: string) {
        navigator.clipboard
            .writeText(text)
            .then(() => message.success("Position copied to clipboard!"))
            .catch(err => message.error(err.message))
    }

    function copy_mode(mode: CartesianDroClipboardOption) {
        const { translation, rotation } = position.position
        const { configuration } = position
        const { x, y, z } = translation
        const tr = `${x},${y},${z}`

        const { x: qx, y: qy, z: qz, w: qw } = rotation
        const {
            x: ex,
            y: ey,
            z: ez
        } = new Euler().setFromQuaternion(new Quaternion(qx, qy, qz, qw))

        const rot = `${qx},${qy},${qz},${qw}`
        const euler = `${ex},${ey},${ez}`

        switch (mode) {
            case CartesianDroClipboardOption.POSITION:
                return set_clipboard(`${tr}`)
            case CartesianDroClipboardOption.POSITION_EULER:
                return set_clipboard(`${tr}:${euler}`)
            case CartesianDroClipboardOption.POSITION_QUATERNION:
                return set_clipboard(`${tr}:${rot}`)
            case CartesianDroClipboardOption.MOVE_LINE:
                return set_clipboard(
                    `moveLine().translation(${tr}).rotation(${rot}).configuration(${configuration})`
                )
            case CartesianDroClipboardOption.MOVE_TO_POSITION:
                return set_clipboard(
                    `moveToPosition().translation(${tr}).rotation(${rot}).configuration(${configuration})`
                )

            default:
                console.log("UNKNOWN MODE", mode, typeof mode)
        }
    }

    function copy_selected_mode(e) {
        const key = Number(e.key) // need it to be a number into enum index
        setSelectedOption(key)
        copy_mode(key)
    }

    function copy_default_mode() {
        console.log("COPY DEFAULT", selectedOption)
        copy_mode(selectedOption)
    }

    return (
        <Tile
            title="Cartesian DRO"
            settings={
                clipboardMode === true ? (
                    <Dropdown.Button
                        size="small"
                        onClick={copy_default_mode}
                        overlay={
                            <Menu
                                selectedKeys={[selectedOption.toString()]}
                                onClick={copy_selected_mode}
                                items={Object.entries(CLIPBOARD_MODE_TITLES).map(
                                    ([key, label]) => ({
                                        key,
                                        label
                                    })
                                )}
                            />
                        }
                    >
                        <CopyOutlined />
                    </Dropdown.Button>
                ) : clipboardMode === false || clipboardMode === undefined ? null : (
                    <Button size="small" onClick={copy_default_mode}>
                        <CopyOutlined />
                    </Button>
                )
            }
        >
            <CartesianDro
                kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                warningThreshold={0.05}
            />
        </Tile>
    )
}
