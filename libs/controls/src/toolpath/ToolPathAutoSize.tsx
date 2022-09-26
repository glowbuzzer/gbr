/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useThree } from "@react-three/fiber"
import * as React from "react"
import { useEffect, useState } from "react"
import { GizmoHelper, GizmoViewcube, OrbitControls, PerspectiveCamera } from "@react-three/drei"

/** @ignore - internal to the tool path tile */
export const ToolPathAutoSize = ({ extent, children }) => {
    const [controls, setControls] = useState(null)
    const {
        camera,
        gl: { domElement }
    } = useThree()

    // useEffect(() => {
    //     camera.position.z = 2 * extent
    //     camera.near = 0.01
    //     camera.far = 10000
    //     camera.up.set(0, 0, 1)
    //     camera.updateProjectionMatrix()
    //
    //     // controls need to be created _after_ setting the camera 'up' property!
    //     setControls(
    //         <>
    //             <OrbitControls camera={camera} enableDamping={false} />
    //             <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
    //                 <GizmoViewcube
    //                     {...{
    //                         faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
    //                     }}
    //                 />
    //                 )
    //             </GizmoHelper>
    //         </>
    //     )
    // }, [extent])

    console.log("Extent: ", extent)

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 3 * extent]}
                far={10000}
                near={0.01}
                up={[0, 0, 1]}
            />
            <OrbitControls camera={camera} enableDamping={false} makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewcube
                    {...{
                        faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                    }}
                />
                )
            </GizmoHelper>
            {/*
            {controls}
*/}
            {children}
        </>
    )
}
