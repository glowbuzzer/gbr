/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import { Sphere } from "@react-three/drei"
import { useUrdfContext } from "./UrdfContextProvider"
import { CentreOfMassIndicator } from "./CentreOfMassIndicator"

export const UrdfFrames = () => {
    const { frames, showFrames, showCentresOfMass } = useUrdfContext()

    function make_root() {
        return frames
            .slice()
            .reverse()
            .reduce((child, frame, index) => {
                return (
                    <group {...frame}>
                        {showFrames && <TriadHelper size={0.2} />}
                        {showCentresOfMass && (
                            <CentreOfMassIndicator position={frame.centreOfMass} />
                        )}
                        {child}
                    </group>
                )
            }, <></>)
    }

    return (
        <>
            {/*
            <group position={[800, 400, 117 + 0.012 * 1000]} scale={1000}>
                {make_root(kdl_frames)}
            </group>
*/}
            <group position={[0, -0, 0]} scale={1000}>
                {make_root()}
            </group>
        </>
    )
}
