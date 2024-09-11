/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import { useUrdfContext } from "./UrdfContextProvider"
import { CentreOfMassIndicator } from "./CentreOfMassIndicator"
import React from "react"
import { InertiaTriadHelper } from "./InertiaTriadHelper"
import { InertiaCuboidHelper } from "./InertiaCuboidHelper"
import { useJointPositions } from "@glowbuzzer/store"
import { WorldPosition } from "./WorldPosition"

export const UrdfFrames = () => {
    const { frames, options } = useUrdfContext()
    const { showFramesURDF, showCentresOfMass, showPrincipleAxesOfInertia, showInertiaCuboid } =
        options
    const joint_positions = useJointPositions(0)
    const joints = joint_positions
        .map((j, index) => {
            return j * frames[index]?.axis.z
        })
        .reverse()

    function make_root() {
        return frames
            .slice()
            .reverse()
            .reduce((child, frame, index) => {
                return (
                    <group {...frame}>
                        <group rotation={[0, 0, joints[index]]}>
                            {showFramesURDF && <TriadHelper size={0.2} />}
                            <group position={frame.centreOfMass}>
                                <group rotation={frame.principleAxes}>
                                    {showCentresOfMass && <CentreOfMassIndicator />}
                                    {showPrincipleAxesOfInertia && (
                                        <InertiaTriadHelper
                                            size={0.04}
                                            moments={frame.principleMoments}
                                        />
                                    )}
                                    {showInertiaCuboid && (
                                        <InertiaCuboidHelper
                                            size={0.001}
                                            values={frame.principleMoments}
                                        />
                                    )}
                                </group>
                            </group>
                            {child}
                        </group>
                    </group>
                )
            }, <>{options.showWorldPositionURDF && frames.length > 0 && <WorldPosition title="URDF World" position="right" />}</>)
    }

    return (
        <>
            <group scale={1000}>{make_root()}</group>
        </>
    )
}
