import React, { createContext, useCallback, useContext, useState } from "react"
import { useConnect, useDigitalInputs, useDigitalOutput, useSoloActivity } from "@glowbuzzer/store"
import { Vector3 } from "three"
import { useStateMachine } from "./StateMachine"

enum ImageType {
    TYPE1,
    TYPE2
}

type AppContextType = {
    running: boolean
    state: string
    previousState?: string
    setRunning(run: boolean): void
}

const appContext = createContext<AppContextType>(null)

export const AppContextProvider = ({ children }) => {
    const conveyor1 = useSoloActivity(0)
    const conveyor2 = useSoloActivity(1)
    const dins = useDigitalInputs()
    const doutExtend = useDigitalOutput(0)
    const doutRetract = useDigitalOutput(1)
    const [extended, retracted, magic_eye] = dins // simple booleans

    const [running, setRunning] = useState(false)

    const [state, prev_state] = useStateMachine(
        {
            idle: {
                transitions: {
                    run_until_magic_eye: running
                }
            },
            run_until_magic_eye: {
                enter: () =>
                    conveyor1
                        .moveJointsAtVelocity([100])
                        .promise()
                        .catch(() => null),
                exit: () => conveyor1.cancel().promise(),
                transitions: {
                    idle: !running,
                    detect_image: magic_eye
                }
            },
            detect_image: {
                enter: async () => {
                    // insert image fetch and detection here
                    const image = await new Promise(resolve =>
                        setTimeout(() => {
                            resolve(Math.random() > 0.5 ? ImageType.TYPE1 : ImageType.TYPE2)
                        }, 2000)
                    )
                    switch (image) {
                        case ImageType.TYPE1:
                            return "eject_type1"
                        case ImageType.TYPE2:
                            return "advance_type2"
                    }
                },
                transitions: {
                    idle: !running
                }
            },
            advance_type2: {
                enter: async () => {
                    await conveyor1.moveLine(new Vector3(100, 0, 0), true).promise()
                    return "extend_cylinder"
                },
                transitions: {
                    idle: !running
                }
            },
            extend_cylinder: {
                enter: () => {
                    doutExtend.set(1)
                },
                exit: () => {
                    doutExtend.set(0)
                },
                transitions: {
                    idle: !running,
                    retract_cylinder: extended
                }
            },
            retract_cylinder: {
                enter: async () => {
                    doutRetract.set(1)
                    // wait and then eject (while still retracting)
                    return new Promise(resolve => setTimeout(resolve, 1000)).then(
                        () => "eject_type2"
                    )
                },
                exit: () => {
                    doutRetract.set(0)
                },
                transitions: {
                    idle: !running
                }
            },
            eject_type1: {
                enter: async () => {
                    await conveyor1.moveLine(new Vector3(500, 0, 0), true).promise()
                    return "run_until_magic_eye"
                },
                exit: () => {
                    conveyor1
                        .cancel()
                        .promise()
                        .catch(() => null)
                },
                transitions: {
                    idle: !running
                }
            },
            eject_type2: {
                enter: async () => {
                    console.log("MOVING CONVEYOR 2")
                    await conveyor2.moveLine(new Vector3(500, 0, 0), true).promise()
                    return "run_until_magic_eye"
                },
                exit: () => {
                    conveyor2
                        .cancel()
                        .promise()
                        .catch(() => null)
                },
                transitions: {
                    idle: !running
                }
            }
        },
        "idle",
        [running, extended, retracted, magic_eye]
    )

    const context = {
        running,
        state,
        previousState: prev_state,
        setRunning
    }
    return <appContext.Provider value={context}>{children}</appContext.Provider>
}

export const useApp = () => {
    const context = useContext(appContext)
    if (!context) {
        throw new Error("No app context in scope!")
    }
    return context
}
