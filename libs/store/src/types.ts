import { Connection } from "./connect/Connection"
import * as THREE from "three"

export type KinematicsConfigurationMcStatus = {
    position: {
        translation: THREE.Vector3
        rotation: THREE.Quaternion
    }
    offset: {
        translation: THREE.Vector3
        rotation: THREE.Quaternion
    }
    froTarget: number
    froActual: number
    currentConfiguration: number
    toolIndex: number
    type: number
}

declare global {
    interface Window {
        connection: Connection
    }
}
