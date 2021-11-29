import { useConnect, useSoloActivity } from "@glowbuzzer/store"
import React, { createContext, FC, useContext, useRef, useState } from "react"
import { ACTIVITYTYPE } from "@glowbuzzer/store"

import { Tile } from "@glowbuzzer/layout"
import { Button } from "antd"

type SoloActivityContextType = {
    moveJoints(pos: number[]): Promise<void>
}

const soloActivityContext = createContext<SoloActivityContextType>(null)

export const SoloActivityProvider: FC = ({ children }) => {
    const connection = useConnect()
    const tag = useRef(1) // initial value will be zero on m7
    const promisesRef = useRef({})

    const context = {
        moveJoints(pos: number[]) {
            const currentTag = tag.current++
            return new Promise<void>((resolve, reject) => {
                // store the functions for later resolution/rejection
                promisesRef.current[currentTag] = { resolve, reject }
                connection.send(
                    JSON.stringify({
                        command: {
                            soloActivity: {
                                0: {
                                    command: {
                                        activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS,
                                        tag: currentTag,
                                        moveJoints: {
                                            jointPositionArray: pos,
                                            positionReference: 0
                                        }
                                    }
                                }
                            }
                        }
                    })
                )
            })
        }
    }
    return <soloActivityContext.Provider value={context}>{children}</soloActivityContext.Provider>
}

export const TutorialOscillatingMoveTile = () => {
    const [complete, setComplete] = useState(false)
    const soloActivity = useSoloActivity(0)

    async function do_promise() {
        setComplete(false)
        console.log("starting1")
        await soloActivity.moveJoints([10, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        await soloActivity.moveJoints([10, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        setComplete(true)
    }

    return (
        <Tile title="Test Oscillating move">
            <Button onClick={do_promise}>Start Move</Button>
            {complete ? "Move complete" : ""}
        </Tile>
    )
}
