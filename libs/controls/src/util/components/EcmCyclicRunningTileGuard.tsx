/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    ECM_CYCLIC_STATE,
    MACHINETARGET,
    useEthercatMasterCyclicStatus,
    useMachineRequestedTarget
} from "@glowbuzzer/store"
import * as React from "react"
import { DockTileDisabledWithNestedSupport } from "../../dock"

export const EcmCyclicRunningTileGuard = ({ children, includeSimMode = false }) => {
    const target = useMachineRequestedTarget()
    const status = useEthercatMasterCyclicStatus()

    const disabled =
        (target === MACHINETARGET.MACHINETARGET_FIELDBUS || includeSimMode) &&
        status !== ECM_CYCLIC_STATE.ECM_CYCLIC_RUNNING

    return (
        <DockTileDisabledWithNestedSupport disabled={disabled} blur content="No EtherCAT Master">
            {children}
        </DockTileDisabledWithNestedSupport>
    )
}
