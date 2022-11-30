/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Connection } from "./connect/Connection"
import { Quaternion, Vector3 } from "three"

export type KinematicsConfigurationMcStatus = {
    position: {
        translation: Vector3
        rotation: Quaternion
    }
    offset: {
        translation: Vector3
        rotation: Quaternion
    }
    froTarget: number
    froActual: number
    currentConfiguration: number
    toolIndex: number
    limitsDisabled: boolean
    type: number
}

declare global {
    interface Window {
        connection: Connection
    }
}
