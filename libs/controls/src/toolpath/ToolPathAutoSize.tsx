/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { GizmoHelper, GizmoViewcube, OrbitControls, PerspectiveCamera } from "@react-three/drei"

/** @ignore - internal to the tool path tile */
export const ToolPathAutoSize = ({ extent, children }) => {
    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 3 * extent]}
                far={10000}
                near={0.01}
                up={[0, 0, 1]}
            />
            <OrbitControls enableDamping={false} makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewcube
                    {...{
                        faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                    }}
                />
                )
            </GizmoHelper>
            {children}
        </>
    )
}
