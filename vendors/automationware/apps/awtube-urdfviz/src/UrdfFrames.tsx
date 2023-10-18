/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import { useUrdfContext } from "./UrdfContextProvider"
import { CentreOfMassIndicator } from "./CentreOfMassIndicator"
import React from "react"
import { InertiaTriadHelper } from "./InertiaTriadHelper"
import { InertiaCuboidHelper } from "./InertiaCuboidHelper"

export const UrdfFrames = () => {
    const { frames, options } = useUrdfContext()
    const { showFrames, showCentresOfMass, showPrincipleAxesOfInertia, showInertiaCuboid } = options

    function make_root() {
        return frames
            .slice()
            .reverse()
            .reduce((child, frame, index) => {
                return (
                    <group {...frame}>
                        {showFrames && <TriadHelper size={0.2} />}
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
                )
            }, <></>)
    }

    return (
        <>
            <group scale={1000}>{make_root()}</group>
        </>
    )
}
