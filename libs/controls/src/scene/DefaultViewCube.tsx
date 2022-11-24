/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GizmoHelper, GizmoViewcube } from "@react-three/drei"
import * as React from "react"

export const DefaultViewCube = () => {
    return (
        <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={0}>
            <GizmoViewcube
                {...{
                    faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                }}
            />
        </GizmoHelper>
    )
}
