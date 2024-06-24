/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    MACHINETARGET,
    useConnection,
    useMachine,
    useSimilationOnlyConfiguration
} from "@glowbuzzer/store"
import { Button } from "antd"

export const StatusBarLiveSwitch = () => {
    const simulationOnly = useSimilationOnlyConfiguration()
    const { connected } = useConnection()
    const machine = useMachine()

    const disabled = simulationOnly || !connected

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
                disabled={disabled}
            >
                Normal
            </Button>
            <Button
                type={live ? undefined : "primary"}
                loading={!live && switching}
                onClick={() => change_target(MACHINETARGET.MACHINETARGET_SIMULATION)}
                disabled={disabled}
            >
                Simulation
            </Button>
        </Button.Group>
    )
}
