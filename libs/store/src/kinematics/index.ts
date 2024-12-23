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
import { Vector3 as Vector3Type, Quaternion } from "three"
import { useMemo } from "react"

export const kinematicsSlice: Slice<GlowbuzzerKinematicsConfigurationStatus[]> = createSlice({
    name: "kinematics",
    initialState: [] as GlowbuzzerKinematicsConfigurationStatus[],
    reducers: {
        status(state, action) {
            return action.payload
        }
    }
})

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
    const state = useSelector<RootState, GlowbuzzerKinematicsConfigurationStatus>(
        ({ kinematics }) => kinematics[kinematicsConfigurationIndex],
        deepEqual
    )
    const frameIndex = config?.frameIndex

    return useMemo(() => {
        if (!state) {
            return {
                position: {
                    translation: new Vector3Type(),
                    rotation: new Quaternion(),
                    positionReference: POSITIONREFERENCE.ABSOLUTE,
                    frameIndex: 0
                },
                configuration: 0
            }
        }

        return {
            configuration: state.configuration,
            position: {
                translation: new Vector3Type().copy(state.position.translation as any),
                rotation: new Quaternion().copy(state.position.rotation as any),
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
    return participatingJoints.map(j => rawJointPositions[j] || 0)
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
