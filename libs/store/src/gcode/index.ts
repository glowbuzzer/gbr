/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createContext, useContext } from "react"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { STREAMCOMMAND, STREAMSTATE } from "../gbc"
import { SoloActivityApi } from "../activity/activity_api"
import { ActivityBuilder } from "../activity"
import { useWorkspaceFrames } from "../frames"
import { streamSlice } from "../stream"

// const { load, save } = settings("gcode")

// export type GCodeSettingsType = {
//     sendEndProgram: boolean
// }

export function updateStreamCommandMsg(
    kinematicsConfigurationIndex: number,
    streamCommand: STREAMCOMMAND
) {
    return JSON.stringify({
        command: {
            stream: {
                [kinematicsConfigurationIndex]: {
                    command: {
                        streamCommand
                    }
                }
            }
        }
    })
}

/**
 * Returns an object containing the state of, and methods to interact with, the execution of gcode in GBC.
 *
 * You can issue gcode using the `send` method, and it will be queued over the current connection. If the
 * amount of gcode sent exceeds the buffer capacity of GBC, processing will start as soon as the buffer is
 * full and continue until no more gcode is sent. Otherwise, execution will start when an M2 "end program"
 * is encountered. It is good practice to append M2 to all of your gcode.
 *
 * You can pause, resume and cancel gcode execution using the `setState` method.
 */
export function useGCode(kinematicsConfigurationIndex = 0): /** Send gcode to execute
 * @param gcode The gcode to send
 * @param vmax The vmax to use for moves. Typically the linear vmax of the kinematics configuration
 */
(gcode: string, vmax: number) => void {
    const context = useGCodeContext()
    const dispatch = useDispatch()
    const workspaceFrames = useWorkspaceFrames()

    return (gcode, vmax: number) => {
        const buffer = []
        // convert the given gcode text into activities and add to buffer
        const interpreter = new GCodeSenderAdapter(
            kinematicsConfigurationIndex,
            buffer,
            vmax,
            workspaceFrames,
            [null, null, null, null, null, null],
            context
        )
        interpreter.execute(gcode)

        dispatch(streamSlice.actions.append({ streamIndex: kinematicsConfigurationIndex, buffer }))
    }
}

export enum GCodeMode {
    CARTESIAN,
    JOINT
}

/**
 * Provides additional context to gcode interpreter. For now, this context provides a mechanism to handle tool change
 * M06 gcode.
 */
export type GCodeContextType = {
    /**
     * Provide an implementation of this function to handle automated tool changes. Typically this function is supplied to
     * {@link GCodeContextProvider}. The function you supply should return an array of activities which achieve the tool change.
     * These activities will be inserted in place of the the M06 code and queued for processing. For example:
     * ```
     *    function handleToolChange(
     *         kinematicsConfigurationIndex: number,
     *         current: number,
     *         next: number,
     *         api: SoloActivityApi
     *     ) {
     *         return [
     *              api.moveToPosition(null, null, 50),
     *              api.setToolOffset(next),
     *              api.dwell(500)
     *         ]
     *     }
     *
     *     return (
     *         <GCodeContextProvider value={{ handleToolChange }}>
     *             ... app ...
     *         </GCodeContextProvider>
     *     )
     * ```
     * @param kinematicsConfigurationIndex The kinematics configuration
     * @param currentToolIndex The current tool index
     * @param newToolIndex The new tool index (set by Tn code)
     * @param api The activity API you can use to create activities to execute
     */
    handleToolChange?(
        kinematicsConfigurationIndex: number,
        currentToolIndex: number,
        newToolIndex: number,
        api: SoloActivityApi
    ): ActivityBuilder[]

    mode?: GCodeMode
}

export const gcodeContext = createContext<GCodeContextType>(null)

export const GCodeContextProvider = gcodeContext.Provider

export function useGCodeContext() {
    return useContext(gcodeContext)
}
