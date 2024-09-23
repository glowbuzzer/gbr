/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ECM_CYCLIC_STATE, useEthercatMasterCyclicStatus } from "@glowbuzzer/store"
import { DockTileDisabledWithNestedSupport } from "../../dock"

type EcmStateGuardProps = {
    requireCyclicRunning?: boolean
    children: React.ReactNode
}

export const EcmStateGuard = ({ requireCyclicRunning, children }: EcmStateGuardProps) => {
    const status = useEthercatMasterCyclicStatus()

    const valid = requireCyclicRunning
        ? status === ECM_CYCLIC_STATE.ECM_CYCLIC_RUNNING
        : status !== ECM_CYCLIC_STATE.ECM_NOT_RUNNING

    return (
        <DockTileDisabledWithNestedSupport disabled={!valid} blur content="No EtherCAT Master">
            {children}
        </DockTileDisabledWithNestedSupport>
    )
}
