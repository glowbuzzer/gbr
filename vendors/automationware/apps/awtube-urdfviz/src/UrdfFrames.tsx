/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import { useUrdfContext } from "./UrdfContextProvider"
import { CentreOfMassIndicator } from "./CentreOfMassIndicator"
import React from "react"
import { InertiaTriadHelper } from "./InertiaTriadHelper"

export const UrdfFrames = () => {
    const { frames, showFrames, showCentresOfMass, showAxesOfInertia } = useUrdfContext()

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
                                {showAxesOfInertia && (
                                    <InertiaTriadHelper
                                        size={0.04}
                                        moments={frame.principleMoments}
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
            <group position={[0, -0, 0]} scale={1000}>
                {make_root()}
            </group>
        </>
    )
}
