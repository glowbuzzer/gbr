import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { KinematicsConfigurationMcStatus } from "../types"
import { useConnection } from "../connect"
import { useConfig } from "../config"
import { useFrames } from "../frames"
import { useRawJointPositions } from "../joints"
import * as THREE from "three"
import { Quaternion, Vector3 } from "three"
import { KinematicsConfigurationCommand, Quat } from "../gbc"

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
    /** The current translation and rotation */
    position: { translation: THREE.Vector3; rotation: THREE.Quaternion }
    /** Any logical offset applied to the kinematics configuration */
    offset: { translation: THREE.Vector3; rotation: THREE.Quaternion }
    /** The current configuration for a robot (waist, elbow, wrist) */
    currentConfiguration: number
    /** The feedrate the kinematics configuration is trying to achieve */
    froTarget: number
    /** The actual feedrate */
    froActual: number
}

export const kinematicsSlice: Slice<KinematicsState[]> = createSlice({
    name: "kinematics",
    initialState: [] as KinematicsState[],
    reducers: {
        status(state, action) {
            // convert inbound state to more friendly redux state
            return action.payload.map(marshal_into_state)
        }
    }
})

function marshal_tr_into_state({
    translation,
    rotation
}: {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
}) {
    const { x, y, z } = translation
    const { z: qz, y: qy, x: qx, w: qw } = rotation

    return {
        translation: { x, y, z },
        rotation: { x: qx, y: qy, z: qz, w: qw }
    }
}

function marshal_into_state(k: KinematicsConfigurationMcStatus) {
    return {
        type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
        currentConfiguration: 0,
        // frameIndex: 0,
        froTarget: k.froTarget,
        froActual: k.froActual,
        position: marshal_tr_into_state(k.position),
        offset: marshal_tr_into_state(k.offset)
    }
}

function unmarshall_tr_from_state({
    translation,
    rotation
}: {
    translation: Vector3
    rotation: Quat
}): {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
} {
    const { z, y, x } = translation
    const { z: qz, y: qy, x: qx, w: qw } = rotation

    return {
        translation: new THREE.Vector3(x, y, z),
        rotation: new THREE.Quaternion(qx, qy, qz, qw)
    }
}

// we're not allowed to put THREE objects into state because they are not serializable,
// so we need to convert the vanilla json objects into THREE version for downstream
function unmarshall_from_state(state: KinematicsConfigurationMcStatus): KinematicsState {
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
            },
            offset: {
                translation: new THREE.Vector3(0, 0, 0),
                rotation: new THREE.Quaternion(0, 0, 0, 1)
            }
        }
    }
    return {
        ...state,
        position: unmarshall_tr_from_state(state.position),
        offset: unmarshall_tr_from_state(state.offset)
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

export function updateOffsetMsg(kc: number, { x, y, z }: Vector3, rotation?: Quaternion) {
    rotation ||= new Quaternion().identity()
    return JSON.stringify({
        command: {
            kinematicsConfiguration: {
                [kc]: {
                    command: {
                        translation: { x, y, z },
                        rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
                    } as KinematicsConfigurationCommand
                }
            }
        }
    })
}

/**
 * Read and manipulate a kinematics configuration.
 *
 * A kinematics configuration (KC) represents a number of
 * joints joined together in a kinematic relationship. The translation and rotation returned is in local
 * kinematics configuration coordinates without any reference frame. You can use {@link useFrames} to convert
 * to other reference frames. The configuration of the KC, typically used for robots, indicates which of the
 * possible configurations (waist, elbow, wrist) the machine is currently in.
 *
 * @param kc The kinematics configuration index
 */
export const useKinematics = (kc: number) => {
    // select the given kc
    const state = unmarshall_from_state(
        useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual)
    )
    const config = useConfig()
    // const frames = useFrames()
    const dispatch = useDispatch()
    const connection = useConnection()
    const rawJointPositions = useRawJointPositions()

    // TODO: seeing 'world' passed here which cannot be found in configs
    const configs = Object.values(config.kinematicsConfiguration)

    const { frameIndex, participatingJoints } = configs[kc] || configs[0]
    const { position, offset } = state
    const { translation, rotation } = position
    const jointPositions = participatingJoints.map(j => rawJointPositions[j])

    return {
        /** The current robot configuration */
        currentConfiguration: state.currentConfiguration,
        // ...state,
        /** The local frame index for the kinematics configuration */
        frameIndex,
        /** The current translation (cartesian position) */
        translation,
        /** The current rotation (cartesian position) */
        rotation,
        /** The positions of all joints in the kinematics configuration */
        jointPositions,
        /** Current logical offset, if any */
        offset,
        /**
         * Set a logical offset to use for moves
         * @param translation Logical translation to apply
         * @param rotation? Logical rotation to apply
         */
        setOffset(translation: Vector3, rotation?: Quaternion) {
            dispatch(() => {
                connection.send(updateOffsetMsg(kc, translation, rotation))
            })
        }
    }
}

export const useTcp = (kc: number, frame: number | "world") => {
    const state = unmarshall_from_state(
        useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual)
    )
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

export function useFeedRate(kc: number) {
    const froActual = useSelector(
        ({ kinematics }: RootState) => kinematics[kc]?.froActual,
        shallowEqual
    )
    const dispatch = useDispatch()
    const connection = useConnection()

    return {
        setFeedRatePercentage(value: number) {
            // TODO: use this value on connect (currently defaults to 100%)
            window.localStorage.setItem(`kinematics.${kc}.fro`, JSON.stringify(value))
            dispatch(() => {
                connection.send(updateFroPercentageMsg(kc, value))
            })
        },
        froActual
    }
}
