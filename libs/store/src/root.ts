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
import { devToolsSlice } from "./devtools"

export const rootReducer = combineReducers({
    config: configSlice.reducer,
    connection: connectionSlice.reducer,
    telemetry: telemetrySlice.reducer,
    prefs: prefsSlice.reducer,
    machine: machineSlice.reducer,
    joints: jointsSlice.reducer,
    gcode: gcodeSlice.reducer,
    toolPath: toolPathSlice.reducer,
    kinematics: kinematicsSlice.reducer,
    devtools: devToolsSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
