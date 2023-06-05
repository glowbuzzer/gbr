/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TRIGGERACTION,
    TRIGGERON,
    TRIGGERTYPE,
    useDigitalInputState,
    useDigitalOutputState,
    useRawJointPositions,
    useSoloActivity,
    useStateMachine
} from "@glowbuzzer/store"
import { appSlice, Conveyor, ObjectType, useAppState } from "./store"
import { DigitalInput, DigitalOutput } from "./constants"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

const CONVEYOR_VELOCITY = 100
const CAMERA_TO_CYLINDER_DISTANCE = 220
const EJECT_TYPE1_DISTANCE = -600
const EJECT_TYPE2_DISTANCE = -600

const delay = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * This component contains the application workflow. This is where the application logic is implemented
 * using the glowbuzzer-provided state machine hook. For more information on the state machine features, see
 * https://glowbuzzer.com/docs/gbr/state_machine.
 */
export const AppWorkflow = () => {
    const { jobEnabled, detectedObjectType } = useAppState()
    const conveyor1 = useSoloActivity(0)
    const conveyor2 = useSoloActivity(1)
    const magic_eye_triggered = useDigitalInputState(DigitalInput.MAGIC_EYE_TRIGGERED)
    const cylinder_extended = useDigitalInputState(DigitalInput.CYLINDER_EXTENDED)
    const [, cameraTrigger] = useDigitalOutputState(DigitalOutput.CAMERA_TRIGGER)
    const [, cylinderTrigger] = useDigitalOutputState(DigitalOutput.CYLINDER)
    const joints = useRawJointPositions()
    const dispatch = useDispatch()

    const conveyors = [conveyor1, conveyor2]

    async function reset_all() {
        cameraTrigger(false, true)
        await Promise.all(conveyors.map(c => c.cancel().promise()))
    }

    async function run_conveyor1() {
        // start the conveyor, configuring it to run until the magic eye is triggered
        dispatch(appSlice.actions.setObjectType(ObjectType.NONE))
        dispatch(appSlice.actions.setDetectedObjectType(ObjectType.NONE))
        await conveyor1
            .moveJointsAtVelocity([-CONVEYOR_VELOCITY])
            .addTrigger({
                type: TRIGGERON.TRIGGERON_DIGITAL_INPUT,
                action: TRIGGERACTION.TRIGGERACTION_CANCEL,
                digital: {
                    when: TRIGGERTYPE.TRIGGERTYPE_RISING,
                    input: DigitalInput.MAGIC_EYE_TRIGGERED
                }
            })
            .promise()
    }

    const { currentState, definition } = useStateMachine(
        {
            idle: {
                // the default state, where the application waits for the job to be enabled
                label: "Idle",
                enter: reset_all,
                transitions: {
                    run_until_magic_eye: jobEnabled
                }
            },
            run_until_magic_eye: {
                // when this state is entered we run the conveyor until magic eye triggered
                label: "Run until magic eye",
                enter: run_conveyor1,
                transitions: {
                    idle: !jobEnabled,
                    detect_image: magic_eye_triggered
                }
            },
            detect_image: {
                // when the magic eye is triggered, the conveyor is stopped and we trigger the camera
                label: "Detect image",
                enter: async () => {
                    await delay(700)
                    cameraTrigger(true, true)
                    await delay(2000)
                    cameraTrigger(false, true)
                },
                transitions: {
                    idle: !jobEnabled,
                    // depending on the detected object type we transition to different states
                    eject_type1: detectedObjectType === ObjectType.DUCK,
                    advance_type2: detectedObjectType === ObjectType.CAR
                }
            },
            advance_type2: {
                // advance the conveyor to the pneumatic cylinder, then extend the cylinder
                label: "Advance Car",
                enter: async () => {
                    await conveyor1
                        .moveJoints([-CAMERA_TO_CYLINDER_DISTANCE])
                        .relative(true)
                        .promise()

                    return "extend_cylinder"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["extend_cylinder"]
            },
            extend_cylinder: {
                // trigger the pneumatic cylinder, then wait until it's extended
                label: "Extend cylinder",
                enter: () => cylinderTrigger(true, true),
                transitions: {
                    idle: !jobEnabled,
                    retract_cylinder: cylinder_extended
                }
            },
            retract_cylinder: {
                // shift the object to the second conveyor and retract the cylinder
                label: "Retract cylinder",
                enter: async () => {
                    dispatch(
                        appSlice.actions.setObjectConveyor({
                            conveyor: Conveyor.CONVEYOR2,
                            position: joints[1]
                        })
                    )

                    cylinderTrigger(false, true)
                    await delay(1000)
                    return "eject_type2"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["eject_type2"]
            },
            eject_type1: {
                // run the first conveyor to eject the duck
                label: "Eject Duck",
                enter: async () => {
                    await conveyor1.moveJoints([EJECT_TYPE1_DISTANCE]).relative(true).promise()
                    return "run_until_magic_eye"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["run_until_magic_eye"]
            },
            eject_type2: {
                // run the second conveyor to eject the car
                label: "Eject Car",
                enter: async () => {
                    await conveyor2.moveJoints([EJECT_TYPE2_DISTANCE]).relative(true).promise()
                    return "run_until_magic_eye"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["run_until_magic_eye"]
            }
        },
        "idle",
        [magic_eye_triggered, cylinder_extended, jobEnabled]
    )

    useEffect(() => {
        // update the state machine state in the redux store, so that it can be displayed in the workflow visualisation
        dispatch(appSlice.actions.setCurrentWorkflowState({ definition, currentState }))
    }, [definition, currentState])

    return null
}
