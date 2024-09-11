/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { create_mesh } from "./singularities"

// we only need to do this once
const mesh = create_mesh()

export const ReachabilityViz = () => {
    return (
        // 325 is the offset from base to the shoulder
        <group scale={1} position={[0, 0, 325]} rotation={[0, 0, 0]}>
            <primitive object={mesh} />
        </group>
    )
}
