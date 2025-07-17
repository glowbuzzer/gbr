/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    ECM_CYCLIC_STATE,
    MACHINETARGET,
    useConnection,
    useEthercatMasterCyclicStatus,
    useMachineTargetState,
    useSimulationOnlyConfiguration
} from "@glowbuzzer/store"
import { Button } from "antd"
import { useCallback, useEffect } from "react"

export const StatusBarLiveSwitch = ({ forceEnabled = false }) => {
    const simulationOnly = useSimulationOnlyConfiguration()
    const { connected } = useConnection()
    const ecm_cyclic_state = useEthercatMasterCyclicStatus()
    const [currentTarget, requestedTarget, setDesiredMachineTarget] = useMachineTargetState()

    const disabled = simulationOnly || !connected
    const live_switch_enabled =
        forceEnabled || ecm_cyclic_state === ECM_CYCLIC_STATE.ECM_CYCLIC_RUNNING

    const change_target = useCallback(
        (v: MACHINETARGET) => {
            setDesiredMachineTarget(v)
        },
        [setDesiredMachineTarget]
    )

    const live = requestedTarget === MACHINETARGET.MACHINETARGET_FIELDBUS
    const switching = connected && currentTarget !== requestedTarget

    return (
        <Button.Group>
            <Button
                type={live ? "primary" : undefined}
                loading={live && switching}
                onClick={() => change_target(MACHINETARGET.MACHINETARGET_FIELDBUS)}
                disabled={disabled || !live_switch_enabled}
            >
                Normal
            </Button>
            <Button
                type={live ? undefined : ("primary" as "primary")}
                loading={!live && switching}
                onClick={() => change_target(MACHINETARGET.MACHINETARGET_SIMULATION)}
                disabled={disabled}
            >
                Simulation
            </Button>
        </Button.Group>
    )
}
