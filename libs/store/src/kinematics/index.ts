import { createSlice, Slice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { KinematicsConfigurationMcStatus } from "../types"
import { useConnection } from "../connect"
import { useConfig } from "../config"
import { useFrames } from "../frames"
import { useRawJointPositions } from "../joints"
import * as THREE from "three"

enum KINEMATICSCONFIGURATIONTYPE {
    TX40,
    TX60,
    TS40,
    TS60,
    CARTESIAN,
    DH6DOF,
    NAKED
}

/**
 * The state of the kinematics configuration
 */
export type KinematicsState = {
    /** The type of kinematics, for example a robot or cartesian machine */
    type: KINEMATICSCONFIGURATIONTYPE // TODO: should come from config
    /** The translation and rotation */
    position: { translation: THREE.Vector3; rotation: THREE.Quaternion }
    /** The current configuration for a robot (waist, elbow, wrist) */
    currentConfiguration: number
    /** The feedrate the kinematics configuration is trying to achieve */
    froTarget: number
    /** The actual feedrate */
    froActual: number
}

export const status_to_redux_state = (k: KinematicsConfigurationMcStatus) => {
    const { x, y, z } = k.cartesianActPos
    const { z: qz, y: qy, x: qx, w: qw } = k.cartesianActOrientation
    return {
        type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
        currentConfiguration: 0,
        // frameIndex: 0,
        froTarget: k.froTarget,
        froActual: k.froActual,
        position: {
            translation: { x, y, z },
            rotation: { x: qx, y: qy, z: qz, w: qw }
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
            position: {
                translation: new THREE.Vector3(0, 0, 0),
                rotation: new THREE.Quaternion(0, 0, 0, 1)
            }
        }
    }
    const { z, y, x } = state.position.translation
    const { z: qz, y: qy, x: qx, w: qw } = state.position.rotation

    return {
        ...state,
        position: {
            translation: new THREE.Vector3(x, y, z),
            rotation: new THREE.Quaternion(qx, qy, qz, qw)
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
 * Read and manipulate a kinematics configuration.
 *
 * A kinematics configuration (KC) represents a number of
 * joints joined together in a kinematic relationship. It also has a feedrate (percentage) and a local
 * frame of reference that can be transformed to other reference frames. The pose of the KC contains
 * the position of the TCP (all machines) and possibly the orientation of the TCP (robots). The configuration
 * of the KC, typically used for robots, indicates which of the possible configurations (waist, elbow, wrist)
 * the machine is currently in.
 *
 * @param kc The kinematics configuration index
 * @param frameIndex The index of the frame into which coordinates will be transformed when read
 */
export const useKinematics = (kc: number, frameIndex: number | "world") => {
    // select the given kc
    const state = unmarshall(useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual))
    const config = useConfig()
    const frames = useFrames()
    const dispatch = useDispatch()
    const connection = useConnection()
    const rawJointPositions = useRawJointPositions()

    // TODO: seeing 'world' passed here which cannot be found in configs
    const configs = Object.values(config.kinematicsConfiguration)

    const { frameIndex: fromIndex, participatingJoints } = configs[kc] || configs[0]

    const jointPositions = participatingJoints.map(j => rawJointPositions[j])

    return {
        ...state,
        /** The local frame index for the kinematics configuration */
        frameIndex: fromIndex,
        /**
         * The position and orientation
         */
        pose: frames.convertToFrame(
            state.position.translation,
            state.position.rotation,
            "world",
            frameIndex
        ),
        /** The positions of all joints in the kinematics configuration */
        jointPositions,
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

export const useTcp = (kc: number, frame: number | "world") => {
    const state = unmarshall(useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual))
    const frames = useFrames()

    return frames.convertToFrame(
        state.position.translation,
        state.position.rotation,
        "world",
        frame
    )
}

export function useJointPositions(kc: number) {
    const rawJointPositions = useRawJointPositions()

    const config = useConfig()
    const kinematicsConfigurations = Object.values(config.kinematicsConfiguration)

    const { participatingJoints } = kinematicsConfigurations[kc] || kinematicsConfigurations[0]

    return participatingJoints.map(j => rawJointPositions[j])
}
