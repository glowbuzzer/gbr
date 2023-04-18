/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { useConnection } from "../connect"
import { useConfig } from "../config"
import { useFrames } from "../frames"
import { useJointCount, useRawJointPositions } from "../joints"
import {
    CartesianPositionsConfig,
    GlowbuzzerKinematicsConfigurationStatus,
    KinematicsConfigurationCommand,
    KinematicsConfigurationConfig,
    POSITIONREFERENCE,
    Quat,
    Vector3
} from "../gbc"
import { useMemo } from "react"

// // TODO: H: remove this and use gbc schema version
// enum KINEMATICSCONFIGURATIONTYPE {
//     TX40,
//     TX60,
//     TS40,
//     TS60,
//     CARTESIAN,
//     DH6DOF,
//     NAKED
// }

/**
 * The state of the kinematics configuration
 */
// export type KinematicsState = {
//     /** The type of kinematics, for example a robot or cartesian machine */
//     type: KC_KINEMATICSCONFIGURATIONTYPE
//     /** The current translation and rotation */
//     position: { translation: THREE.Vector3; rotation: THREE.Quaternion }
//     /** Any logical offset applied to the kinematics configuration */
//     offset: { translation: THREE.Vector3; rotation: THREE.Quaternion }
//     /** The current configuration for a robot (waist, elbow, wrist) */
//     currentConfiguration: number
//     /** The feedrate the kinematics configuration is trying to achieve */
//     froTarget: number
//     /** The actual feedrate */
//     froActual: number
//     /** The current tool index */
//     toolIndex: number
//     /** Indicates if limit checking is currently disabled */
//     limitsDisabled: boolean
// }

export const kinematicsSlice: Slice<GlowbuzzerKinematicsConfigurationStatus[]> = createSlice({
    name: "kinematics",
    initialState: [] as GlowbuzzerKinematicsConfigurationStatus[],
    reducers: {
        status(state, action) {
            return action.payload
        }
    }
})

// function marshal_tr_into_state({
//     translation,
//     rotation
// }: {
//     translation: THREE.Vector3
//     rotation: THREE.Quaternion
// }) {
//     const { x, y, z } = translation
//     const { z: qz, y: qy, x: qx, w: qw } = rotation
//
//     return {
//         translation: { x, y, z },
//         rotation: { x: qx, y: qy, z: qz, w: qw }
//     }
// }

// function marshal_into_state(k: KinematicsConfigurationMcStatus) {
//     return {
//         type: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
//         currentConfiguration: 0,
//         // frameIndex: 0,
//         froTarget: k.froTarget,
//         froActual: k.froActual,
//         position: marshal_tr_into_state(k.position),
//         offset: marshal_tr_into_state(k.offset),
//         toolIndex: k.toolIndex,
//         limitsDisabled: k.limitsDisabled
//     }
// }
//
// function unmarshall_tr_from_state({
//     translation,
//     rotation
// }: {
//     translation: Vector3
//     rotation: Quat
// }): {
//     translation: Vector3
//     rotation: Quaternion
// } {
//     const { z, y, x } = translation
//     const { z: qz, y: qy, x: qx, w: qw } = rotation
//
//     return {
//         translation: new Vector3(x, y, z),
//         rotation: new Quaternion(qx, qy, qz, qw)
//     }
// }

// we're not allowed to put THREE objects into state because they are not serializable,
// so we need to convert the vanilla json objects into THREE version for downstream
// function unmarshall_from_state(state: KinematicsConfigurationMcStatus): KinematicsState {
//     if (!state) {
//         // ensure downstream always has something to work with even if just a default
//         return {
//             type: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
//             currentConfiguration: 0,
//             // frameIndex: 0,
//             froTarget: 0,
//             froActual: 0,
//             position: {
//                 translation: new Vector3(0, 0, 0),
//                 rotation: new Quaternion(0, 0, 0, 1)
//             },
//             offset: {
//                 translation: new Vector3(0, 0, 0),
//                 rotation: new Quaternion(0, 0, 0, 1)
//             },
//             toolIndex: 0,
//             limitsDisabled: false
//         }
//     }
//     return {
//         ...state,
//         position: state.position,
//         offset: state.offset,
//         toolIndex: state.toolIndex,
//         limitsDisabled: state.limitsDisabled
//     }
// }

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

export function updateOffsetMsg(kc: number, translation: Vector3, rotation?: Quat) {
    rotation ||= { x: 0, y: 0, z: 0, w: 1 }
    translation ||= { x: 0, y: 0, z: 0 }
    return JSON.stringify({
        command: {
            kinematicsConfiguration: {
                [kc]: {
                    command: {
                        translation,
                        rotation
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
 * Provides a list of kinematics configurations in the configuration
 */
export function useKinematicsConfigurationList() {
    const config = useConfig()
    return config.kinematicsConfiguration || []
}

/** Provides the current state of all kinematics configurations, including translation and rotation. */
export function useKinematicsList() {
    return useSelector(({ kinematics }: RootState) => kinematics, deepEqual)
}

const NULL_KINEMATICS: KinematicsConfigurationConfig = {
    participatingJoints: []
}

/**
 * Read the state of a kinematics configuration.
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
    const state: GlowbuzzerKinematicsConfigurationStatus = useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex],
        deepEqual
    )
    const rawJointPositions = useRawJointPositions()
    const { participatingJoints } = useKinematicsConfiguration(kinematicsConfigurationIndex)

    const jointPositions = useMemo(
        () => participatingJoints?.map(j => rawJointPositions[j]),
        [rawJointPositions, participatingJoints]
    )

    const empty_position = {
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 }
    }
    return {
        // ensure that position is not undefined
        position: empty_position,
        offset: empty_position,
        ...state,
        jointPositions
    }
}

/**
 * Returns the configuration settings for the given kinematics configuration
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export const useKinematicsConfiguration = (kinematicsConfigurationIndex: number) => {
    const jointCount = useJointCount()
    const list = useKinematicsConfigurationList()
    const config = list[kinematicsConfigurationIndex]
    if (config && !config.participatingJoints) {
        throw new Error(
            "Invalid kinematics configuration. A participatingJoints array must be defined."
        )
    }
    return (
        config || {
            ...NULL_KINEMATICS,
            participatingJoints: Array.from(Array(jointCount).keys())
        }
    )
}

/** Provides a list of all current positions (translation and rotation) across the kinematics configurations */
export const useKinematicsConfigurationPositions = () => {
    const state: GlowbuzzerKinematicsConfigurationStatus[] = useSelector(
        ({ kinematics }: RootState) => kinematics,
        deepEqual
    )
    return state.map(s => s.position)
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
// export const useTcp = (kc: number, frame: number | "world") => {
//     const state = unmarshall_from_state(
//         useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual)
//     )
//     const frames = useFrames()
//
//     return frames.convertToFrame(
//         state.position.translation,
//         state.position.rotation,
//         "world",
//         frame
//     )
// }

/**
 * Returns the current position for all joints in a kinematics configuration, in the order they are given
 * in the configuration.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useJointPositions(kinematicsConfigurationIndex: number) {
    const rawJointPositions = useRawJointPositions()
    const { participatingJoints } = useKinematicsConfiguration(kinematicsConfigurationIndex)
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

type PositionType = { translation?: Vector3; rotation?: Quat }

// noinspection JSValidateJSDoc
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
export function useKinematicsOffset(
    kinematicsConfigurationIndex: number
): [PositionType, (offset: PositionType) => void] {
    const connection = useConnection()
    const offset = useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex]?.offset,
        deepEqual
    )

    function setOffset({ translation, rotation }: PositionType) {
        connection.send(updateOffsetMsg(kinematicsConfigurationIndex, translation, rotation))
    }

    return [offset, setOffset]
}

/**
 * Returns whether kinematic limits are currently disabled, and a method to enable/disable them.
 *
 * Kinematics limits can be disabled to allow jogging when a machine has run beyond its soft limits.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useKinematicsLimitsDisabled(
    kinematicsConfigurationIndex: number
): [boolean, (boolean) => void] {
    const connection = useConnection()
    const value = useSelector(
        ({ kinematics }: RootState) => kinematics[kinematicsConfigurationIndex]?.limitsDisabled
    )

    function setValue(disabled: boolean) {
        connection.send(updateDisableLimitsMsg(kinematicsConfigurationIndex, disabled))
    }

    return [value, setValue]
}

/**
 * Returns the index of the currently active tool for the given kinematics configuration.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index
 */
export function useToolIndex(kinematicsConfigurationIndex: number): number {
    return useSelector(({ kinematics }: RootState) => {
        return kinematics[kinematicsConfigurationIndex]?.toolIndex
    })
}

type ExtentsType = {
    extentsX: number[]
    extentsY: number[]
    extentsZ: number[]
    max: number
}

/** Provides the extents of the machine. That is, the union of the extents of all configured kinematics configurations. */
export function useKinematicsExtents(kinematicsConfigurationIndex?: number): ExtentsType {
    const config = useConfig()

    function merge(current: ExtentsType, next: ExtentsType): ExtentsType {
        const safe_next = {
            extentsX: next.extentsX || [0, 0],
            extentsY: next.extentsY || [0, 0],
            extentsZ: next.extentsZ || [0, 0],
            max: next.max || 0
        }

        return current
            ? {
                  extentsX: [
                      Math.min(current.extentsX[0], safe_next.extentsX[0]),
                      Math.max(current.extentsX[1], safe_next.extentsX[1])
                  ],
                  extentsY: [
                      Math.min(current.extentsY[0], safe_next.extentsY[0]),
                      Math.max(current.extentsY[1], safe_next.extentsY[1])
                  ],
                  extentsZ: [
                      Math.min(current.extentsZ[0], safe_next.extentsZ[0]),
                      Math.max(current.extentsZ[1], safe_next.extentsZ[1])
                  ],
                  max: Math.max(current.max, safe_next.max)
              }
            : next
    }

    function apply(current: ExtentsType, kinematicsConfiguration: KinematicsConfigurationConfig) {
        const { extentsX, extentsY, extentsZ } = kinematicsConfiguration
        const max =
            Math.max.apply(
                Math.max,
                [extentsX, extentsY, extentsZ].flat().map(v => Math.abs(v))
            ) || 100
        const next = {
            extentsX,
            extentsY,
            extentsZ,
            max
        }
        return merge(current, next)
    }

    if (kinematicsConfigurationIndex === undefined) {
        return config.kinematicsConfiguration.reduce<ExtentsType>(apply, null)
    }

    return apply(null, config.kinematicsConfiguration[kinematicsConfigurationIndex])
}
