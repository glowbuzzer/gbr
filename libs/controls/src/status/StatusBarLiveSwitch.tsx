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
    useSimulationOnlyConfiguration,
    useStepMasterBootSuccessful
} from "@glowbuzzer/store"
import { Button, Space } from "antd"
import { useCallback, useEffect } from "react"
import { useMasterBootSuccessful, useStepMasterMode } from "../app"

export const StatusBarLiveSwitch = ({ forceEnabled = false }) => {
    const simulationOnly = useSimulationOnlyConfiguration()
    const { connected } = useConnection()
    const [currentTarget, requestedTarget, setDesiredMachineTarget] = useMachineTargetState()
    const boot_successful = useMasterBootSuccessful()

    const disabled = simulationOnly || !connected
    const live_switch_enabled = forceEnabled || boot_successful

    const change_target = useCallback(
        (v: MACHINETARGET) => {
            setDesiredMachineTarget(v)
        },
        [setDesiredMachineTarget]
    )

    const live = requestedTarget === MACHINETARGET.MACHINETARGET_FIELDBUS
    const switching = connected && currentTarget !== requestedTarget

    return (
        <Space.Compact>
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
        </Space.Compact>
    )
}
