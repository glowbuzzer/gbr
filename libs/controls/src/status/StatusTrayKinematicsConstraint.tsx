/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    MachineState,
    OPERATION_ERROR,
    useKinematicsLimitsDisabled,
    useMachine
} from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { Button, Dropdown } from "antd"

export const StatusTrayKinematicsConstraint = () => {
    const { currentState, operationError } = useMachine()
    const [, setDisabled] = useKinematicsLimitsDisabled(0)
    const [timerTick, setTimerTick] = React.useState(0)
    const fault = currentState === MachineState.FAULT

    React.useEffect(() => {
        if (timerTick > 0) {
            const timer = setTimeout(() => {
                setTimerTick(current => current - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
        // timer at zero
        if (timerTick === 0) {
            setDisabled(false)
        }
    }, [timerTick])

    function start(seconds: number) {
        setDisabled(true)
        setTimerTick(seconds)
    }

    function stop() {
        setTimerTick(0)
    }

    function menu_click({ key }) {
        start(key)
    }

    const items = [
        {
            key: 60,
            label: "60 Seconds"
        },
        {
            key: 300,
            label: "5 Minutes"
        },
        {
            key: -1,
            label: "Indefinitely"
        }
    ]

    if (
        timerTick === 0 &&
        (!fault || operationError !== OPERATION_ERROR.OPERATION_ERROR_KINEMATICS_ENVELOPE_VIOLATION)
    ) {
        return null
    }

    console.log("timerTick", timerTick, operationError)
    return (
        <StatusTrayItem
            id="kinematics_constraint"
            actions={
                <>
                    {timerTick === 0 ? (
                        <Dropdown.Button
                            size="small"
                            onClick={() => start(60)}
                            menu={{ items, onClick: menu_click }}
                        >
                            Disable
                        </Dropdown.Button>
                    ) : (
                        <Button size="small" onClick={stop}>
                            Enable {timerTick > 0 && <>&nbsp;({timerTick})</>}
                        </Button>
                    )}
                </>
            }
        >
            {timerTick < 0 ? (
                <>Kinemantics envelope constraints are disabled until you re-enable them</>
            ) : timerTick > 0 ? (
                <>Kinemantics envelope constraints are temporarily disabled</>
            ) : (
                <>
                    A kinematics envelope constraint has been violated. You can disable the
                    constraints and attempt to move the machine to a valid position
                </>
            )}
        </StatusTrayItem>
    )
}
