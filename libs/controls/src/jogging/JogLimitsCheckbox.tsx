import {
    updateDisableLimitsMsg,
    useConnection,
    useKinematicsLimitsDisabled
} from "@glowbuzzer/store"
import { Checkbox } from "antd"
import React from "react"

export const JogLimitsCheckbox = ({ kinematicsConfigurationIndex }) => {
    const connection = useConnection()
    const disabled = useKinematicsLimitsDisabled(kinematicsConfigurationIndex)

    function toggle_disable_limits() {
        connection.send(updateDisableLimitsMsg(kinematicsConfigurationIndex, !disabled))
    }

    return (
        <Checkbox
            style={{ float: "right" }}
            checked={!disabled}
            disabled={!connection.connected}
            onClick={toggle_disable_limits}
        >
            Enable limits
        </Checkbox>
    )
}