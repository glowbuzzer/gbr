import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState, TASK_COMMAND, TaskStatus, useConfig, useConnect } from "@glowbuzzer/store"

// export enum TaskState {
//     NOTSTARTED,
//     RUNNING,
//     FINISHED,
//     PAUSED,
//     STOPPING,
//     CANCELLED,
//     ERROR
// }
//
// export enum TaskCommand {
//     NONE,
//     RUN,
//     CANCEL,
//     PAUSE,
//     RESUME
// }
//
// type TaskStatus = {
//     state: TaskState
//     currentActivityIndex: number
// }

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: [] as TaskStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useTaskStatus() {
    const config = useConfig()
    const status = useSelector(({ tasks }: RootState) => tasks, shallowEqual)

    return Object.keys(config.task).map((k, index) => ({
        name: k,
        status: status[index] || { taskState: 0, currentActivityIndex: 0 }
    }))
}

export function useTask(taskIndex: number) {
    const connection = useConnect()
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

    // here we need to reconstruct the activityCount and firstActivityIndex for each task
    let abs_activity_index = 0
    const tasks = Object.keys(config.task).map((k, index) => {
        const task = config.task[k]
        const activity_names = Object.keys(task)

        const activities = activity_names.map(a => {
            return {
                name: a,
                sendCommand: (index => command => sendActivityCommand(index, command))(abs_activity_index++)
            }
        })

        return {
            name: k,
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
