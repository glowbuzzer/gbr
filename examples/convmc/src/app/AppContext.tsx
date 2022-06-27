/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useContext, useState } from "react"
import {
    useDigitalInputs,
    useDigitalOutputState,
    useSoloActivity,
    useStateMachine
} from "@glowbuzzer/store"
import { appContext } from "./AppContextType"
import ColorThief from "colorthief"

enum ImageType {
    TYPE1,
    TYPE2
}

const CONVEYOR_VELOCITY = 50
const MAGIC_EYE_TO_CAMERA_MS = 300
export const CAMERA_TO_CYLINDER_DISTANCE = 80
const EJECT_TYPE1_DISTANCE = 200
const EJECT_TYPE2_DISTANCE = 200

function toHue(r, g, b) {
    // convert rgb values to the range of 0-1
    r /= 255
    g /= 255
    b /= 255

    // find min and max values out of r,g,b components
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h
    const delta = max - min
    console.log("DELTA", delta)
    if (max === r) {
        // if red is the predominent color
        h = (g - b) / delta
    } else if (max === g) {
        // if green is the predominent color
        h = 2 + (b - r) / delta
    } else if (max === b) {
        // if blue is the predominent color
        h = 4 + (r - g) / delta
    }

    h = h * 60 // find the sector of 60 degrees to which the color belongs

    // https://www.pathofexile.com/forum/view-thread/1246208/page/45 - hsl color wheel

    if (h < 0) {
        // h is a negative angle.
        h = 360 - h
    }

    return Math.floor(h)
}

async function delay(next_state, time) {
    return new Promise(resolve => setTimeout(() => resolve(next_state), time))
}

function ignored(promise) {
    return promise
        .then(() => null)
        .catch(e => {
            console.log("Ignore error from state machine promise", e)
        })
}

export const AppContextProvider = ({ children }) => {
    const conveyor1 = useSoloActivity(0)
    const conveyor2 = useSoloActivity(1)
    const dins = useDigitalInputs()
    const [, setDoutCamera] = useDigitalOutputState(3)
    const [, setDoutExtend] = useDigitalOutputState(8)
    const [, setDoutRetract] = useDigitalOutputState(9)
    const [extended, retracted, magic_eye] = dins // simple booleans

    const [running, setRunning] = useState(false)

    const { currentState, previousState, userData } = useStateMachine(
        {
            idle: {
                enter: () => ignored(conveyor1.cancel().promise()),
                transitions: {
                    run_until_magic_eye: running
                }
            },
            run_until_magic_eye: {
                enter: () => ignored(conveyor1.moveJointsAtVelocity([CONVEYOR_VELOCITY]).promise()),
                transitions: {
                    idle: !running,
                    advance_to_camera: magic_eye
                }
            },
            advance_to_camera: {
                enter: async () => {
                    await delay(null, MAGIC_EYE_TO_CAMERA_MS)
                    await ignored(conveyor1.cancel().promise())
                    return "detect_image"
                },
                transitions: {
                    idle: !running
                }
            },
            detect_image: {
                enter: async () => {
                    // insert image fetch and detection here
                    setDoutCamera(true)
                    await delay(null, 100)
                    setDoutCamera(false)
                    await delay(null, 3000)

                    const { image_type, base64 } = await new Promise(resolve => {
                        function randomise() {
                            console.log("IMAGE LOAD ERROR - REVERTING TO RANDOM SELECTION")
                            setTimeout(() => {
                                const image_type =
                                    Math.random() > 0.5 ? ImageType.TYPE1 : ImageType.TYPE2
                                resolve({ image_type, base64: null })
                            }, 500)
                        }

                        const image = new Image()
                        image.onload = () => {
                            try {
                                const ct = new ColorThief()
                                // TODO: passing wrong type?
                                const [r, g, b] = ct.getColor(image)
                                const hue = toHue(r, g, b)
                                console.log("LOADED IMAGE, HUE ==", hue, "RGB ==", r, g, b)

                                const c = document.createElement("canvas")
                                c.height = image.naturalHeight
                                c.width = image.naturalWidth
                                const ctx = c.getContext("2d")

                                ctx.drawImage(image, 0, 0, c.width, c.height)
                                const base64 = c.toDataURL()

                                resolve({
                                    image_type: hue < 220 ? ImageType.TYPE1 : ImageType.TYPE2,
                                    base64
                                })
                            } catch (e) {
                                randomise()
                            }
                        }
                        image.onerror = () => {
                            console.log("IMAGE ONERROR TRIGGERED")
                            randomise()
                        }
                        image.crossOrigin = "Anonymous"
                        image.src = "http://rpi-camera/camera_image.png?" + Math.random()
                    })
                    return {
                        state: image_type === ImageType.TYPE1 ? "eject_type1" : "advance_type2",
                        data: base64
                    }
                },
                transitions: {
                    idle: !running
                }
            },
            advance_type2: {
                enter: () =>
                    ignored(
                        conveyor1
                            .moveLine(CAMERA_TO_CYLINDER_DISTANCE, 0, 0)
                            .relative(true)
                            .promise()
                    ).then(() => "extend_cylinder"),
                transitions: {
                    idle: !running
                }
            },
            extend_cylinder: {
                enter: () => setDoutExtend(true),
                exit: () => setDoutExtend(false),
                transitions: {
                    idle: !running,
                    retract_cylinder: extended
                }
            },
            retract_cylinder: {
                enter: () => {
                    setDoutRetract(true)
                    // wait and then eject (while still retracting)
                    return new Promise(resolve => setTimeout(resolve, 1000)).then(
                        () => "eject_type2"
                    )
                },
                exit: () => {
                    setDoutRetract(false)
                },
                transitions: {
                    idle: !running
                }
            },
            eject_type1: {
                enter: () =>
                    ignored(
                        conveyor1.moveLine(EJECT_TYPE1_DISTANCE, 0, 0).relative(true).promise()
                    ).then(() => "run_until_magic_eye"),
                exit: () => conveyor1.cancel().promise(),
                transitions: {
                    idle: !running
                }
            },
            eject_type2: {
                enter: () =>
                    ignored(
                        conveyor2.moveLine(-EJECT_TYPE2_DISTANCE, 0, 0).relative(true).promise()
                    ).then(() => "run_until_magic_eye"),
                exit: () => conveyor2.cancel().promise(),
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
        state: currentState,
        previousState,
        data: userData,
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
