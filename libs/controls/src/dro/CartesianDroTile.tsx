import { useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { Button, Dropdown, Menu, message } from "antd"
import { Euler, Quaternion } from "three"
import { Tile } from "../tiles"
import { CopyOutlined } from "@ant-design/icons"
import * as React from "react"
import { CartesianDro, CartesianDroClipboardOption } from "./CartesianDro"

const CLIPBOARD_MODE_TITLES = {
    [CartesianDroClipboardOption.POSITION]: "Position",
    [CartesianDroClipboardOption.POSITION_EULER]: "Position + Euler",
    [CartesianDroClipboardOption.POSITION_QUATERNION]: "Position + Quaternion",
    [CartesianDroClipboardOption.MOVE_LINE]: "MoveLine API",
    [CartesianDroClipboardOption.MOVE_TO_POSITION]: "MoveToPosition API"
}

type CartesianDroTileProps = {
    /** The kinematics configuration to display */
    kinematicsConfigurationIndex?: number
    /** The clipboard mode to provide, if any */
    clipboardMode?: true | false | CartesianDroClipboardOption
}

/**
 * The cartesian DRO tile shows the current position of a kinematics configuration. It also provides an option to
 * zero the current X, Y and Z using the Zero DRO button. When you zero the DRO, all subsequent moves will be translated
 * such that the origin is the current tool position. The orientation of the tool is unaffected by this setting.
 *
 * The clipboard mode property gives options to let the user to copy the current position in various formats. Valid options are:
 *
 * `false`
 *
 * : No clipboard copy provided
 *
 * `true`
 *
 * : Provide a menu of all copy formats allowing the user to choose.
 *
 * `CartesianDroClipboardOption.POSITION`
 *
 * : Simple comma separated list of x,y,z
 *
 * `CartesianDroClipboardOption.POSITION_EULER`
 *
 * : Position and orientation in the form x,y,z:a,b,c
 *
 * `CartesianDroClipboardOption.POSITION_QUATERNION`
 *
 * : Position and orientation in the form x,y,z:qx,qy,qz,qw
 *
 * `CartesianDroClipboardOption.MOVE_LINE`
 *
 * : Solo activity API code for move line activity.
 *
 * `CartesianDroClipboardOption.MOVE_TO_POSITION`
 *
 * : Solo activity API code for move to position activity.
 *
 */
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
