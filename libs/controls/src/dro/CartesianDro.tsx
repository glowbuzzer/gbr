/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Euler } from "three"
import {
    apply_offset,
    useFrames,
    useKinematics,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import { DroItem } from "./DroItem"
import styled from "styled-components"

type CartesianDisplayProps = {
    /**
     * The index of the kinematics configuration in the current configuration.
     */
    kinematicsConfigurationIndex: number

    /**
     * The index of the frame.
     */
    frameIndex: number

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

const StyledGrid = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 8px;

    .label {
        font-weight: bold;
        text-align: center;
        border: 1px solid ${props => props.theme.colorBorder};
        padding: 0 4px;
    }
    .value {
        text-align: right;
    }
`

/**
 * Displays position and orientation given a kinematics configuration index.
 */
export const CartesianDro = ({
    kinematicsConfigurationIndex,
    frameIndex,
    select,
    warningThreshold
}: CartesianDisplayProps) => {
    const kinematics = useKinematics(kinematicsConfigurationIndex)
    const { frameIndex: localFrameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { convertToFrame } = useFrames()

    const p = convertToFrame(
        kinematics.position.translation,
        kinematics.position.rotation,
        localFrameIndex,
        frameIndex
    )

    const { translation, rotation } = apply_offset(p, kinematics.offset, true)

    // this is the local xyz, used to warn when tcp is near/outside of kc limits
    // const local_translation = kinematics.position.translation

    const euler = new Euler().setFromQuaternion(rotation)

    const labels = {
        x: "X",
        y: "Y",
        z: "Z",
        a: "Rx",
        b: "Ry",
        c: "Rz"
    }

    const pos = {
        x: translation.x,
        y: translation.y,
        z: translation.z,
        a: euler.x,
        b: euler.y,
        c: euler.z
    }

    const display = select ? select.split(",").map(s => s.trim()) : Object.keys(pos)

    return (
        <StyledGrid>
            {display.map(k => {
                // TODO: L: check against envelope constraints
                // const axis_extents = extents[k]
                //
                // function should_warn() {
                //     const value = local_translation[k]
                //     if (axis_extents) {
                //         const [min, max] = axis_extents
                //         const tolerance = (max - min) * warningThreshold
                //         return value < min + tolerance || value > max - tolerance
                //     }
                // }

                return (
                    <DroItem
                        key={k}
                        label={labels[k]}
                        value={pos[k]}
                        type={types[k]}
                        // error={should_warn()}
                    />
                )
            })}
        </StyledGrid>
    )
}
