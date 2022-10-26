/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { TASK_COMMAND, TaskStatus } from "../gbc"
import { useConfig } from "../config"
import { RootState } from "../root"
import { useConnection } from "../connect"
import deepEqual from "fast-deep-equal"

export const tasksSlice: Slice<TaskStatus[]> = createSlice({
    name: "tasks",
    initialState: [] as TaskStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

/** Returns the status of all tasks as an array along with each task's current activity index */
export function useTaskStatus(): {
    name: string
    status: TaskStatus
}[] {
    const config = useConfig()
    const status = useSelector(({ tasks }: RootState) => tasks, deepEqual)

    return (
        config.task?.map((k, index) => ({
            name: k.name,
            status: status[index] || { taskState: 0, currentActivityIndex: 0 }
        })) || []
    )
}

/**
 * Returns task name plus methods to run, cancel and reset a task.
 *
 * After a task is completed or cancelled it must be reset before it can be run again.
 *
 * @param taskIndex The index of the task in the configuration
 */
export function useTask(taskIndex: number): {
    /** Run the task */
    run(): void
    /** Cancel a running task */
    cancel(): void
    /** Reset the task, ready to run again */
    reset(): void
    /**
     * @ignore - Not supported
     */
    activities: {
        name: string
        sendCommand: (command) => void
    }[]
} {
    const connection = useConnection()
    const config = useConfig()

    function sendTaskCommand(index: number, command: TASK_COMMAND) {
        connection.send(
            JSON.stringify({
                command: {
                    task: {
                        [index]: {
                            command: {
                                taskCommand: command
                            }
                        }
                    }
                }
            })
        )
    }

    function sendActivityCommand(index: number, command) {
        connection.send(
            JSON.stringify({
                command: {
                    activity: {
                        [index]: {
                            command
                        }
                    }
                }
            })
        )
    }

    const tasks = config.task.map(task => {
        const activities = Array.from({ length: task.activityCount }).map((_, index) => {
            const activityIndex = task.firstActivityIndex + index

            return {
                name: config.activity[activityIndex].name,
                sendCommand: command => sendActivityCommand(activityIndex, command)
            }
        })

        return {
            name: task.name,
            activities
        }
    })

    return tasks.map((task, index) => ({
        ...task,
        run() {
            sendTaskCommand(index, TASK_COMMAND.TASK_RUN)
        },
        cancel() {
            sendTaskCommand(index, TASK_COMMAND.TASK_CANCEL)
        },
        reset() {
            sendTaskCommand(index, TASK_COMMAND.TASK_IDLE)
        }
    }))[taskIndex]
}
