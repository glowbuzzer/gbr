/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createContext, useContext } from "react"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { useDispatch } from "react-redux"
import { ActivityBuilder } from "../activity"
import { useWorkspaceFrames } from "../frames"
import { streamSlice } from "../stream"
import { ActivityApi } from "../activity"

// const { load, save } = settings("gcode")

// export type GCodeSettingsType = {
//     sendEndProgram: boolean
// }

/**
 * Returns a function you can use to send gcode to GBC. The gcode will be queued and executed over the current
 * connection. By default activites will start executing immediately. However, streams can be configured to require
 * an M2 "end program" activity to be sent. If this mode is enabled, and the amount of gcode sent exceeds the buffer capacity
 * of GBC, processing will start as soon as the buffer is full and continue until no more gcode is sent. Otherwise,
 * execution will start when an M2 is encountered.
 *
 * You can pause, resume and cancel gcode execution using the {@link useStream} hook.
 *
 * @param kinematicsConfigurationIndex The index of the kinematics configuration to use for the gcode
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
     *
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
     *
     * @param kinematicsConfigurationIndex The kinematics configuration
     * @param currentToolIndex The current tool index
     * @param newToolIndex The new tool index (set by Tn code)
     * @param api The activity API you can use to create activities to execute
     */
    handleToolChange?(
        kinematicsConfigurationIndex: number,
        currentToolIndex: number,
        newToolIndex: number,
        api: ActivityApi
    ): ActivityBuilder[]

    /** Provides a way to control whether gcode moves such as G1 X100 Y100 should be interpreted as linear or joint space moves */
    mode?: GCodeMode
}

const gcodeContext = createContext<GCodeContextType>(null)

/**
 * Use this component to provide additional context to the gcode interpreter. This context provides a mechanism to handle tool changes,
 * and to indicate if moves should be made in joint or cartesian space.
 */
export const GCodeContextProvider = gcodeContext.Provider

/** @ignore used by the gcode interpreter and not intended for use by applications */
export function useGCodeContext() {
    return useContext(gcodeContext)
}
