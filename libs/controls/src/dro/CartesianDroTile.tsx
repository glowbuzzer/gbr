/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    useKinematics,
    useKinematicsCartesianPosition,
    useKinematicsConfiguration,
    useKinematicsOffset
} from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { Dropdown, message } from "antd"
import { Euler, Quaternion } from "three"
import { DownOutlined } from "@ant-design/icons"
import * as React from "react"
import { useState } from "react"
import { CartesianDro } from "./CartesianDro"
import { DockToolbarButtonGroup } from "../dock"
import { ReactComponent as CopyIcon } from "@material-symbols/svg-400/outlined/content_copy.svg"
import { ReactComponent as ZeroDRO } from "@material-symbols/svg-400/outlined/ads_click.svg"
import { ReactComponent as ResetDRO } from "@material-symbols/svg-400/outlined/block.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import styled from "styled-components"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../frames"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { RobotConfigurationDro } from "./RobotConfigurationDro"

const StyledDownOutlined = styled(DownOutlined)`
    display: inline-block;
    transform: translate(0, -3px);
    cursor: pointer;
    color: #bfbfbf;
`

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
    /** The kinematics configuration to display. If not specified a dropdown of kinematics configurations will be displayed */
    kinematicsConfigurationIndex?: number
    /** The clipboard mode to provide, if any */
    clipboardMode?: true | false | CartesianDroClipboardOption
}

/**
 * The cartesian DRO tile shows the current position of a kinematics configuration.
 *
 * It provides an option to zero the current X, Y and Z using the Zero DRO button. When you zero the DRO, all subsequent moves
 * will be translated such that the origin is the current tool position. The orientation of the tool is unaffected by this setting.
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
    kinematicsConfigurationIndex: fixedKinematicsConfigurationIndex = null,
    clipboardMode = true
}: CartesianDroTileProps) => {
    const [frameIndex, setFrameIndex] = useState(0)
    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(
        fixedKinematicsConfigurationIndex || 0
    )

    const position = useKinematicsCartesianPosition(kinematicsConfigurationIndex)
    const kinematics = useKinematics(kinematicsConfigurationIndex)
    const { supportedConfigurationBits } = useKinematicsConfiguration(kinematicsConfigurationIndex)

    const [, setOffset] = useKinematicsOffset(kinematicsConfigurationIndex)

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
        copy_mode(selectedOption)
    }

    function zero_dro() {
        setOffset(kinematics.position)
    }

    function reset_dro() {
        setOffset({
            translation: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 }
        })
    }

    const tooltip = `Copy ${CLIPBOARD_MODE_TITLES[selectedOption]} to clipboard`

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <DockToolbarButtonGroup>
                        {fixedKinematicsConfigurationIndex === null && (
                            <KinematicsDropdown
                                value={kinematicsConfigurationIndex}
                                onChange={setKinematicsConfigurationIndex}
                            />
                        )}
                        <FramesDropdown value={frameIndex} onChange={setFrameIndex} />
                    </DockToolbarButtonGroup>

                    <DockToolbarButtonGroup>
                        <GlowbuzzerIcon
                            Icon={ZeroDRO}
                            button
                            title={"Zero DRO"}
                            onClick={zero_dro}
                        />
                        <GlowbuzzerIcon
                            Icon={ResetDRO}
                            button
                            title={"Reset DRO"}
                            onClick={reset_dro}
                        />
                    </DockToolbarButtonGroup>

                    <DockToolbarButtonGroup>
                        {clipboardMode === true ? (
                            <>
                                <GlowbuzzerIcon
                                    title={tooltip}
                                    Icon={CopyIcon}
                                    button
                                    onClick={copy_default_mode}
                                />
                                <Dropdown
                                    trigger={["click"]}
                                    menu={{
                                        selectedKeys: [selectedOption.toString()],
                                        onClick: copy_selected_mode,
                                        items: Object.entries(CLIPBOARD_MODE_TITLES).map(
                                            ([key, label]) => ({
                                                key,
                                                label
                                            })
                                        )
                                    }}
                                >
                                    <StyledDownOutlined />
                                </Dropdown>
                            </>
                        ) : clipboardMode === false || clipboardMode === undefined ? null : (
                            <GlowbuzzerIcon
                                useFill={true}
                                title={tooltip}
                                Icon={CopyIcon}
                                button
                                onClick={copy_default_mode}
                            />
                        )}
                    </DockToolbarButtonGroup>
                </>
            }
        >
            <StyledTileContent>
                {supportedConfigurationBits ? (
                    <div>
                        <RobotConfigurationDro
                            value={kinematics.configuration}
                            supportedConfigurationBits={supportedConfigurationBits}
                        />
                    </div>
                ) : null}
                <CartesianDro
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    frameIndex={frameIndex}
                    warningThreshold={0.01}
                />
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
