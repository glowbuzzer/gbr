/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    ECM_CYCLIC_STATE,
    MACHINETARGET,
    useConnection,
    useEthercatMasterCyclicStatus,
    useMachine,
    useSimilationOnlyConfiguration
} from "@glowbuzzer/store"
import { Button } from "antd"

export const StatusBarLiveSwitch = () => {
    const simulationOnly = useSimilationOnlyConfiguration()
    const { connected } = useConnection()
    const ecm_cyclic_state = useEthercatMasterCyclicStatus()
    const machine = useMachine()

    const disabled = simulationOnly || !connected
    const live_switch_enabled = ecm_cyclic_state === ECM_CYCLIC_STATE.ECM_CYCLIC_RUNNING

    function change_target(v: MACHINETARGET) {
        machine.setDesiredMachineTarget(v)
    }

    const live = machine.requestedTarget === MACHINETARGET.MACHINETARGET_FIELDBUS
    const switching = connected && machine.target !== machine.requestedTarget

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
