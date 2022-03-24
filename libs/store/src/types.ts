import { Connection } from "./connect/Connection"
import * as THREE from "three"

// export enum ACTIVITYTYPE {
//     MOVEJOINTSATVELOCITY,
//     MOVELINE,
//     MOVEARC,
//     MOVESPLINE,
//     MOVEJOINTS,
//     MOVETOPOSITION,
//     MOVELINEWITHFORCE,
//     MOVETOPOSITIONWITHFORCE,
//     GEARINPOS,
//     GEARINVELO,
//     GEARINDYN,
//     SETDOUT,
//     SETAOUT,
//     DWELL,
//     WAITON,
//     SWITCHPOSE,
//     LATCH
// }

// export enum KINEMATICSCONFIGURATIONTYPE {
//     TX40,
//     TX60,
//     TS40,
//     TS60,
//     CARTESIAN,
//     DH6DOF,
//     NAKED
// }

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
    type: number
}

declare global {
    interface Window {
        connection: Connection
    }
}

export const TEST = 42
