/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {configSlice} from "./config"
import {telemetrySlice} from "./telemetry"
import {prefsSlice} from "./prefs"
import {machineSlice} from "./machine"
import {jointsSlice} from "./joints"
import {traceSlice} from "./trace"
import {kinematicsSlice} from "./kinematics"
import {previewSlice} from "./preview"
import {
    digitalInputsSlice,
    externalDigitalInputsSlice,
    safetyDigitalInputsSlice,
    modbusDigitalInputsSlice
} from "./io/din"
import {
    digitalOutputsSlice,
    externalDigitalOutputsSlice,
    safetyDigitalOutputsSlice,
} from "./io/dout"
import {analogInputsSlice} from "./io/ain"
import {analogOutputsSlice} from "./io/aout"
import {
    externalIntegerInputsSlice,
    externalUnsignedIntegerInputsSlice,
    modbusUnsignedIntegerInputsSlice,
    integerInputsSlice,
    unsignedIntegerInputsSlice
} from "./io/iin"
import {
    externalIntegerOutputsSlice,
    externalUnsignedIntegerOutputsSlice,
    integerOutputsSlice,
    unsignedIntegerOutputsSlice
} from "./io/iout"
import {tasksSlice} from "./tasks"
import {framesSlice} from "./frames"
import {activitySlice} from "./activity"
import {pointsSlice} from "./points"
import {streamSlice} from "./stream"
import {emstatSlice} from "./emstat"
import {serialSlice} from "./serial"
import undoable from "redux-undo"
import {flowSlice} from "./flow"
import {monitorSlice} from "./monitor"
import {overrideable} from "./overrideable"
import {gbdbSlice} from "./gbdb"

export const standardReducers = {
    gbdb: gbdbSlice.reducer,
    config: configSlice.reducer,
    tasks: tasksSlice.reducer,
    activity: activitySlice.reducer,
    telemetry: telemetrySlice.reducer,
    prefs: prefsSlice.reducer,
    machine: machineSlice.reducer,
    joints: jointsSlice.reducer,
    points: pointsSlice.reducer,
    frames: framesSlice.reducer,
    // din: overrideable<boolean>(digitalInputsSlice),
    // safetyDin: overrideable<boolean>(safetyDigitalInputsSlice),
    din: digitalInputsSlice.reducer,
    safetyDin: safetyDigitalInputsSlice.reducer,


    externalDin: externalDigitalInputsSlice.reducer,
    // modbusDin: overrideable<boolean>(modbusDigitalInputsSlice),
    modbusDin: modbusDigitalInputsSlice.reducer,
    dout: digitalOutputsSlice.reducer,
    safetyDout: safetyDigitalOutputsSlice.reducer,
    externalDout: externalDigitalOutputsSlice.reducer,
    ain: analogInputsSlice.reducer,
    aout: analogOutputsSlice.reducer,
    iin: integerInputsSlice.reducer,
    uiin: unsignedIntegerInputsSlice.reducer,
    externalIin: externalIntegerInputsSlice.reducer,
    externalUiin: externalUnsignedIntegerInputsSlice.reducer,
    modbusUiin: modbusUnsignedIntegerInputsSlice.reducer,
    iout: integerOutputsSlice.reducer,
    uiout: unsignedIntegerOutputsSlice.reducer,
    externalIout: externalIntegerOutputsSlice.reducer,
    externalUiout: externalUnsignedIntegerOutputsSlice.reducer,
    stream: streamSlice.reducer,
    preview: previewSlice.reducer,
    trace: traceSlice.reducer,
    kinematics: kinematicsSlice.reducer,
    emstat: emstatSlice.reducer,
    serial: serialSlice.reducer,
    flow: undoable(flowSlice.reducer),
    monitor: monitorSlice.reducer
}

// export const rootReducer = combineReducers(standardReducers)
type StandardReducers = typeof standardReducers
export type RootState = {
    [K in keyof StandardReducers]: ReturnType<StandardReducers[K]>
}
// export type RootState = ReturnType<typeof rootReducer>
