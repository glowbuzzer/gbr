/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Environment } from "@react-three/drei"

export const DefaultEnvironment = () => {
    return (
        <Environment
            // @ts-ignore
            files={`${import.meta.env.BASE_URL}assets/environment/aerodynamics_workshop_1k.hdr`}
        />
    )
}
