import React, { useEffect } from "react"
import { useConnection, useTask } from "@glowbuzzer/store"

export const CartesianApp = props => {
    const connection = useConnection()
    const task = useTask(2)

    useEffect(() => {
        if (connection.connected && task?.activities?.length) {
            task.activities[0].sendCommand({
                moveJointsAtVelocity: { jointVelocityArray: [40, 0, 0] }
            })
        }
    }, [task, connection.connected])

    return props.children
}
