/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

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
import {
    CartesianPosition,
    CartesianPositionsConfig,
    KinematicsConfigurationCommand,
    POSITIONREFERENCE,
    Quat
} from "../gbc"
import { useMemo } from "react"

// TODO: H: remove this and use gbc schema version
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
    /** The current tool index */
    toolIndex: number
    /** Indicates if limit checking is currently disabled */
    limitsDisabled: boolean
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
        offset: marshal_tr_into_state(k.offset),
        toolIndex: k.toolIndex,
        limitsDisabled: k.limitsDisabled
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
            },
            toolIndex: 0,
            limitsDisabled: false
        }
    }
    return {
        ...state,
        position: unmarshall_tr_from_state(state.position),
        offset: unmarshall_tr_from_state(state.offset),
        toolIndex: state.toolIndex,
        limitsDisabled: state.limitsDisabled
    }
}

export function updateFroMsg(kc: number, value: number) {
    return JSON.stringify({
        command: {
            kinematicsConfiguration: {
                [kc]: {
                    command: {
                        fro: value
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

export function updateDisableLimitsMsg(kc: number, disableLimits) {
    return JSON.stringify({
        command: {
            kinematicsConfiguration: {
                [kc]: {
                    command: {
                        disableLimits
                    } as KinematicsConfigurationCommand
                }
            }
        }
    })
}

/**
 * Returns a list of kinematics configurations in the configuration
 */
export function useKinematicsConfigurationList() {
    const config = useConfig()
    return config.kinematicsConfiguration
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
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export const useKinematics = (kinematicsConfigurationIndex: number) => {
    // select the given kc
    const state = unmarshall_from_state(
        useSelector(
            ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex],
            deepEqual
        )
    )
    // const frames = useFrames()
    const dispatch = useDispatch()
    const connection = useConnection()
    const rawJointPositions = useRawJointPositions()

    // TODO: seeing 'world' passed here which cannot be found in configs
    const configs = useKinematicsConfigurationList()

    const { frameIndex, participatingJoints } = configs[kinematicsConfigurationIndex] || configs[0]
    const { position, offset } = state
    const { translation, rotation } = position
    const jointPositions = useMemo(
        () => participatingJoints.map(j => rawJointPositions[j]),
        [rawJointPositions, participatingJoints]
    )

    return {
        /** The current robot configuration */
        currentConfiguration: state.currentConfiguration,
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
            // dispatch<any>(() => {
            connection.send(updateOffsetMsg(kinematicsConfigurationIndex, translation, rotation))
            // })
        }
    }
}

/**
 * Returns the configuration settings for the given kinematics configuration
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export const useKinematicsConfiguration = (kinematicsConfigurationIndex: number) => {
    const list = useKinematicsConfigurationList()
    return list[kinematicsConfigurationIndex] || list[0]
}

/**
 * Returns the current cartesian position of the kinematics configuration given.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export const useKinematicsCartesianPosition = (kinematicsConfigurationIndex: number) => {
    const config = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const state = useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex],
        deepEqual
    )
    const frameIndex = config?.frameIndex

    return useMemo<CartesianPositionsConfig>(() => {
        if (!state) {
            return {
                position: {
                    translation: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0, w: 1 },
                    positionReference: POSITIONREFERENCE.ABSOLUTE,
                    frameIndex: 0
                },
                configuration: 0
            }
        }

        return {
            configuration: state?.currentConfiguration,
            position: {
                ...state.position,
                frameIndex: frameIndex,
                positionReference: POSITIONREFERENCE.ABSOLUTE
            }
        }
    }, [state, frameIndex])
}

/** @ignore - not currently supported */
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

/**
 * Returns the current position for all joints in a kinematics configuration, in the order they are given
 * in the configuration.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useJointPositions(kinematicsConfigurationIndex: number) {
    const rawJointPositions = useRawJointPositions()

    const kinematicsConfigurations = useKinematicsConfigurationList()

    const { participatingJoints } =
        kinematicsConfigurations[kinematicsConfigurationIndex] || kinematicsConfigurations[0]

    return participatingJoints.map(j => rawJointPositions[j])
}

/**
 * Returns the current feedrate and a method to set the desired feedrate for a given kinematics configuration.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useFeedRate(kinematicsConfigurationIndex: number) {
    const connection = useConnection()

    const { froActual, froTarget } = useSelector(({ kinematics }: RootState) => {
        const { froActual, froTarget } = kinematics[kinematicsConfigurationIndex] || {}
        return { froActual, froTarget }
    }, deepEqual)

    return {
        setFeedRatePercentage(value: number) {
            // TODO: use this value on connect (currently defaults to 100%)
            window.localStorage.setItem(
                `kinematics.${kinematicsConfigurationIndex}.fro`,
                JSON.stringify(value)
            )
            connection.send(updateFroMsg(kinematicsConfigurationIndex, value))
        },
        froActual,
        froTarget
    }
}

/**
 * Returns the current offset for the kinematics configuration.
 *
 * This is normally set using the Zero DRO feature in the {@link CartesianDroTile}, but can be set by issuing
 * a {@link KinematicsConfigurationCommand} to GBC.
 *
 * Note that providing a rotation offset is not currently supported.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useKinematicsOffset(kinematicsConfigurationIndex: number): {
    translation: Vector3
    rotation: Quaternion
} {
    return useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex]?.offset,
        deepEqual
    )
}

/**
 * Returns whether kinematic limits are currently disabled.
 *
 * Kinematics limits can be disabled to allow jogging when a machine has run beyond its soft limits.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useKinematicsLimitsDisabled(kinematicsConfigurationIndex: number) {
    return useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex]?.limitsDisabled
    )
}

/**
 * Returns the index of the currently active tool for the given kinematics configuration.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useToolIndex(kinematicsConfigurationIndex: number): number {
    return useSelector(({ kinematics }: RootState) => {
        return kinematics[kinematicsConfigurationIndex]?.toolIndex
    }, shallowEqual)
}
