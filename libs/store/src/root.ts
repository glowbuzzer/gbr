/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { combineReducers } from "@reduxjs/toolkit"
import { configSlice } from "./config"
import { connectionSlice } from "./connect"
import { telemetrySlice } from "./telemetry"
import { prefsSlice } from "./prefs"
import { machineSlice } from "./machine"
import { jointsSlice } from "./joints"
import { gcodeSlice } from "./gcode"
import { toolPathSlice } from "./toolpath"
import { kinematicsSlice } from "./kinematics"
import { previewSlice } from "./preview"
import { digitalInputsSlice } from "./io/din"
import { digitalOutputsSlice } from "./io/dout"
import { analogInputsSlice } from "./io/ain"
import { analogOutputsSlice } from "./io/aout"
import { integerInputsSlice } from "./io/iin"
import { integerOutputsSlice } from "./io/iout"
import { tasksSlice } from "./tasks"
import { framesSlice } from "./frames"
import { activitySlice } from "./activity"
import { pointsSlice } from "./points"

export const standardReducers = {
    config: configSlice.reducer,
    connection: connectionSlice.reducer,
    tasks: tasksSlice.reducer,
    activity: activitySlice.reducer,
    telemetry: telemetrySlice.reducer,
    prefs: prefsSlice.reducer,
    machine: machineSlice.reducer,
    joints: jointsSlice.reducer,
    points: pointsSlice.reducer,
    frames: framesSlice.reducer,
    din: digitalInputsSlice.reducer,
    dout: digitalOutputsSlice.reducer,
    ain: analogInputsSlice.reducer,
    aout: analogOutputsSlice.reducer,
    iin: integerInputsSlice.reducer,
    iout: integerOutputsSlice.reducer,
    gcode: gcodeSlice.reducer,
    preview: previewSlice.reducer,
    toolPath: toolPathSlice.reducer,
    kinematics: kinematicsSlice.reducer
}

export const rootReducer = combineReducers(standardReducers)

export type RootState = ReturnType<typeof rootReducer>
