import { createSlice, Slice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { KinematicsConfigurationMcStatus } from "../types"
import { useConnect } from "../connect"
import { useConfig } from "../config"
import { useFrames } from "../frames"
import { Quaternion, Vector3 } from "three"

const IDENTITY_ROTATION = { x: 0, y: 0, z: 0, w: 1 }

enum KINEMATICSCONFIGURATIONTYPE {
    TX40,
    TX60,
    TS40,
    TS60,
    CARTESIAN,
    DH6DOF,
    NAKED
}

type Pose = {
    position: Vector3
    orientation: Quaternion
}

/**
 * The state of the kinematics configuration
 */
export type KinematicsState = {
    /** The type of kinematics, for example a robot or cartesian machine */
    type: KINEMATICSCONFIGURATIONTYPE // TODO: should come from config
    /** The position and orientation */
    pose: Pose
    /** The current configuration for a robot (waist, elbow, wrist) */
    currentConfiguration: number
    /** The feedrate the kinematics configuration is trying to achieve */
    froTarget: number
    /** The actual feedrate */
    froActual: number
}

export const status_to_redux_state = (k: KinematicsConfigurationMcStatus) => {
    const { x, y, z } = k.cartesianActPos
    return {
        type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
        currentConfiguration: 0,
        // frameIndex: 0,
        froTarget: k.froTarget,
        froActual: k.froActual,
        pose: {
            position: { x, y, z },
            orientation: IDENTITY_ROTATION
        }
    }
}

export const kinematicsSlice: Slice<KinematicsState[]> = createSlice({
    name: "kinematics",
    initialState: [] as KinematicsState[],
    reducers: {
        status(state, action) {
            // convert inbound state to more friendly redux state
            return action.payload.map(status_to_redux_state)
        }
    }
})

// we're not allowed to put THREE objects into state because they are not serializable,
// so we need to convert the vanilla json objects into THREE version for downstream
function unmarshall(state): KinematicsState {
    if (!state) {
        // ensure downstream always has something to work with even if just a default
        return {
            type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
            currentConfiguration: 0,
            // frameIndex: 0,
            froTarget: 0,
            froActual: 0,
            pose: {
                position: new Vector3(0, 0, 0),
                orientation: new Quaternion(0, 0, 0, 1)
            }
        }
    }
    const { z, y, x } = state.pose.position
    const { z: qz, y: qy, x: qx, w: qw } = state.pose.orientation

    return {
        ...state,
        pose: {
            position: new Vector3(x, y, z),
            orientation: new Quaternion(qx, qy, qz, qw)
        }
    }
}

export function updateFroPercentageMsg(kc: number, value: number) {
    return JSON.stringify({
        command: {
            kinematicsConfiguration: {
                [kc]: {
                    command: {
                        froPercentage: value
                    }
                }
            }
        }
    })
}

/**
 * Read and manipulate a kinematics configuration
 * @param kc The kinematics configuration index
 * @param frameIndex The index of the frame into which coordinates will be transformed when read
 */
export const useKinematics = (kc: number, frameIndex: number | "world") => {
    // select the given kc
    const state = unmarshall(useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual))
    const config = useConfig()
    const frames = useFrames()
    const dispatch = useDispatch()
    const connection = useConnect()

    // TODO: seeing 'world' passed here which cannot be found in configs
    const configs = Object.values(config.kinematicsConfiguration)
    const fromIndex = (configs[kc] || configs[0]).frameIndex

    return {
        ...state,
        /** The local frame index for the kinematics configuration */
        frameIndex: fromIndex,
        /**
         * The position and orientation
         */
        pose: frames.convertToFrame(
            state.pose.position,
            state.pose.orientation,
            "world",
            frameIndex
        ),
        /**
         * Set the feed rate override
         * @param value Percentage from 0-100. If set to zero the machine will pause all motion
         */
        setFroPercentage(value: number) {
            window.localStorage.setItem(`kinematics.${kc}.statusFrequency`, JSON.stringify(value))
            dispatch(() => {
                connection.send(updateFroPercentageMsg(kc, value))
            })
        }
    }
}
