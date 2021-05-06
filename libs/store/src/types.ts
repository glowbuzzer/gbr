import { Connection } from "./connect/Connection"

// export enum ACTIVITYTYPE {
//     MOVEATVELOCITY,
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
    cartesianActPos: {
        x: number
        y: number
        z: number
    }
    cartesianActOrientation: {
        x: number
        y: number
        z: number
        w: number
    }
    froTarget: number
    froActual: number
    configuration: number
}

declare global {
    interface Window {
        connection: Connection
    }
}

export const TEST = 42
