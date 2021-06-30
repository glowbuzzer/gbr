import { Tile } from "@glowbuzzer/layout"
import React, { createContext, FC, useContext, useRef, useState } from "react"
import { Button } from "antd"
import { useConnect, useSoloActivity } from "@glowbuzzer/store"
import { Vector3 } from "three"

type SoloActivityContextType = {
    moveLine(pos: Vector3): Promise<void>
}

const soloActivityContext = createContext<SoloActivityContextType>(null)

export const SoloActivityProvider: FC = ({ children }) => {
    const connection = useConnect()
    const activityArray = useSoloActivity()
    const tag = useRef(1) // initial value will be zero on m7
    const promisesRef = useRef({})

    // useEffect(() => {
    //     const promises = promisesRef.current
    //     for (const { tag, state } of activityArray) {
    //         if (promises[tag] && state === ActivityState.ACTIVITY_COMPLETED) {
    //             promises[tag].resolve()
    //             delete promises[tag]
    //         }
    //     }
    // }, [activityArray])

    const context = {
        moveLine(pos: Vector3) {
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
                                        activityType: 2,
                                        tag: currentTag,
                                        moveLine: {
                                            line: {
                                                position: pos
                                            }
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

export const TestMotionTile = () => {
    const [complete, setComplete] = useState(false)
    const soloActivity = useContext(soloActivityContext)

    async function do_promise() {
        setComplete(false)
        await soloActivity.moveLine(new Vector3(10, 0, 0))
        await soloActivity.moveLine(new Vector3(10, 10, 0))
        await soloActivity.moveLine(new Vector3(0, 10, 0))
        await soloActivity.moveLine(new Vector3(0, 0, 0))
        setComplete(true)
    }

    return (
        <Tile title="Test Motion">
            <Button onClick={do_promise}>DO MOVE</Button>
            {complete ? "OPERATION COMPLETE" : ""}
        </Tile>
    )
}
