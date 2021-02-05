import React, { useEffect } from "react"
import { useConnect, useTask, useTaskStatus } from "@glowbuzzer/store"

export const CartesianApp = props => {
    const connection = useConnect()
    const task = useTask(2)

    useEffect(() => {
        if (connection.connected && task?.activities?.length) {
            task.activities[0].sendCommand({
                moveAtVelocity: { jointVelocityArray: [40, 0, 0] }
            })
        }
    }, [task, connection.connected])

    return props.children
}
