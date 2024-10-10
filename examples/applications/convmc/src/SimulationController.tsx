/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    MachineState,
    MACHINETARGET,
    useDigitalInputOverrides,
    useDigitalOutputState,
    useMachineCurrentState,
    useMachineTargetState,
    useRawJointPositions
} from "@glowbuzzer/store"
import { useEffect } from "react"
import { DigitalInput, DigitalOutput } from "./constants"
import { appSlice, Conveyor, ObjectType, useAppState } from "./store"
import { useDispatch } from "react-redux"

const CYLINDER_TRAVEL_TIME = 1500
const MAGIC_EYE_TRIGGER_MIN = 250
const MAGIC_EYE_TRIGGER_MAX = 350

/**
 * This component is responsible for simulating aspects of the machine behavior (when in simulation mode only).
 */
export const SimulationController = () => {
    const currentState = useMachineCurrentState()
    const [target] = useMachineTargetState()
    const [{ effectiveValue: cylinderTriggered }] = useDigitalOutputState(DigitalOutput.CYLINDER)
    const { set } = useDigitalInputOverrides()
    const [, setMagicEyeLoopback] = useDigitalOutputState(DigitalOutput.MAGIC_EYE_LOOPBACK)
    const { objectType, objectConveyor, objectInitialPosition, cylinderPosition } = useAppState()
    const joints = useRawJointPositions()

    const enabled = currentState === MachineState.OPERATION_ENABLED
    const simulation = target === MACHINETARGET.MACHINETARGET_SIMULATION
    const dispatch = useDispatch()

    // simulate the pneumatic cylinder behaviour (extended and retracted digital inputs)
    useEffect(() => {
        if (simulation) {
            // by default clear both inputs when something changes
            set(DigitalInput.CYLINDER_RETRACTED, false, true)
            set(DigitalInput.CYLINDER_EXTENDED, false, true)

            // determine which input to set
            const input = cylinderTriggered
                ? DigitalInput.CYLINDER_EXTENDED
                : DigitalInput.CYLINDER_RETRACTED

            setTimeout(() => {
                // after a short delay, set the appropriate input
                set(input, true, true)
            }, CYLINDER_TRAVEL_TIME)
        }
    }, [enabled, simulation, cylinderTriggered])

    const conveyorPosition = joints[Conveyor.CONVEYOR1]
    const objectCurrentPosition = objectInitialPosition - (conveyorPosition || 0)

    // simulate the magic eye being triggered when an object on the conveyor is in the correct position
    useEffect(() => {
        if (simulation) {
            const triggered =
                objectType !== ObjectType.NONE &&
                objectConveyor === Conveyor.CONVEYOR1 &&
                objectCurrentPosition > MAGIC_EYE_TRIGGER_MIN &&
                objectCurrentPosition < MAGIC_EYE_TRIGGER_MAX

            // the magic eye input is looped back from a digital output when in simulation mode
            setMagicEyeLoopback(triggered, true)
        }
    }, [simulation, objectType, objectCurrentPosition, objectConveyor])

    // simulate the movement of the object from one conveyor to the other as the pneumatic cylinder is extended
    useEffect(() => {
        if (simulation) {
            if (objectType !== ObjectType.NONE && cylinderTriggered && cylinderPosition > 0.02) {
                dispatch(appSlice.actions.setObjectY(cylinderPosition - 0.02))
            }
        }
    }, [simulation, objectType, objectConveyor, cylinderTriggered, cylinderPosition])

    return null
}
