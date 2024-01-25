/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { combineReducers } from "@reduxjs/toolkit"
import { configSlice } from "./config"
// import { connectionSlice } from "./connect"
import { telemetrySlice } from "./telemetry"
import { prefsSlice } from "./prefs"
import { machineSlice } from "./machine"
import { jointsSlice } from "./joints"
import { traceSlice } from "./trace"
import { kinematicsSlice } from "./kinematics"
import { previewSlice } from "./preview"
import { digitalInputsSlice, externalDigitalInputsSlice, safetyDigitalInputsSlice } from "./io/din"
import { digitalOutputsSlice, externalDigitalOutputsSlice } from "./io/dout"
import { analogInputsSlice } from "./io/ain"
import { analogOutputsSlice } from "./io/aout"
import {
    externalIntegerInputsSlice,
    externalUnsignedIntegerInputsSlice,
    integerInputsSlice,
    unsignedIntegerInputsSlice
} from "./io/iin"
import {
    externalIntegerOutputsSlice,
    externalUnsignedIntegerOutputsSlice,
    integerOutputsSlice,
    unsignedIntegerOutputsSlice
} from "./io/iout"
import { tasksSlice } from "./tasks"
import { framesSlice } from "./frames"
import { activitySlice } from "./activity"
import { pointsSlice } from "./points"
import { streamSlice } from "./stream"
import { emstatSlice } from "./emstat"

export const standardReducers = {
    config: configSlice.reducer,
    tasks: tasksSlice.reducer,
    activity: activitySlice.reducer,
    telemetry: telemetrySlice.reducer,
    prefs: prefsSlice.reducer,
    machine: machineSlice.reducer,
    joints: jointsSlice.reducer,
    points: pointsSlice.reducer,
    frames: framesSlice.reducer,
    din: digitalInputsSlice.reducer,
    safetyDin: safetyDigitalInputsSlice.reducer,
    externalDin: externalDigitalInputsSlice.reducer,
    dout: digitalOutputsSlice.reducer,
    externalDout: externalDigitalOutputsSlice.reducer,
    ain: analogInputsSlice.reducer,
    aout: analogOutputsSlice.reducer,
    iin: integerInputsSlice.reducer,
    uiin: unsignedIntegerInputsSlice.reducer,
    externalIin: externalIntegerInputsSlice.reducer,
    externalUiin: externalUnsignedIntegerInputsSlice.reducer,
    iout: integerOutputsSlice.reducer,
    uiout: unsignedIntegerOutputsSlice.reducer,
    externalIout: externalIntegerOutputsSlice.reducer,
    externalUiout: externalUnsignedIntegerOutputsSlice.reducer,
    stream: streamSlice.reducer,
    preview: previewSlice.reducer,
    trace: traceSlice.reducer,
    kinematics: kinematicsSlice.reducer,
    emstat: emstatSlice.reducer
}

export const rootReducer = combineReducers(standardReducers)

export type RootState = ReturnType<typeof rootReducer>
