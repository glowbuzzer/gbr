import React from "react"
import { Alert } from "antd"
import { MachineState, useMachine } from "@glowbuzzer/store"

export const ConditionalDisplayInOpEnabled = ({ children }) => {
    const { currentState } = useMachine()

    if (currentState === "OPERATION_ENABLED") {
        return (
            <Alert
                message="The machine is in operation enabled"
                description="You only can change the configuration outside of the operation enabled state"
                type="warning"
                showIcon
            />
        )
    }

    return <>{children}</>
}
