/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    MACHINETARGET,
    useConnection,
    useLiveModeEnabled,
    useMachine,
    useMachineConfig,
    useSafetyDigitalInputList,
    useSimilationOnlyConfiguration
} from "@glowbuzzer/store"
import { Button, Dropdown, MenuProps } from "antd"

export const StatusBarLiveSwitch = () => {
    const simulationOnly = useSimilationOnlyConfiguration()
    const { connected, send } = useConnection()
    const live_switch_enabled = useLiveModeEnabled()
    const machine = useMachine()
    const safetyInputs = useSafetyDigitalInputList()
    const machineConfig = useMachineConfig()

    const supports_safety = !!machineConfig.$metadata?.safetyStateInput
    const disabled = simulationOnly || !connected

    function change_target(v: MACHINETARGET) {
        machine.setDesiredMachineTarget(v)
    }

    function override_safety_state_simulated() {
        // we're going to force all inputs into the non-negative state
        const overrides = Object.fromEntries(
            safetyInputs.map((input, index) => {
                return [
                    index,
                    {
                        command: {
                            setValue: input.$metadata?.negativeState ? 0 : 1, // non-negative state
                            override: true
                        }
                    }
                ]
            })
        )

        send(
            JSON.stringify({
                command: {
                    safetyDin: {
                        ...overrides
                    }
                }
            })
        )
    }

    const live = machine.requestedTarget === MACHINETARGET.MACHINETARGET_FIELDBUS
    const switching = connected && machine.target !== machine.requestedTarget

    const sim_button_props = {
        type: live ? undefined : ("primary" as "primary"),
        loading: !live && switching,
        onClick() {
            change_target(MACHINETARGET.MACHINETARGET_SIMULATION)
        },
        disabled: disabled,
        menu: supports_safety
            ? {
                  items: [
                      {
                          key: "make_safe",
                          label: "Simulate Required Safety Inputs",
                          onClick: override_safety_state_simulated
                      }
                  ]
              }
            : undefined
    }
    const SimButton = supports_safety ? Dropdown.Button : Button

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
            <SimButton {...sim_button_props}>Simulation</SimButton>
        </Button.Group>
    )
}
