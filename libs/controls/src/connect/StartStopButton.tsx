import React from "react"
import { DesiredState, MachineState } from "@glowbuzzer/store"
import { Button } from "antd"
import { PoweroffOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { SizeType } from "antd/lib/config-provider/SizeContext"

const StyledButton = styled(Button)<{ power: boolean }>`
    background: ${props => (props.power ? "green" : "red")};
    opacity: 0.6;
    border: none;
    border-radius: 5px;
    //height: 28px;
    :hover {
        opacity: 1;
        background: ${props => (props.power ? "green" : "red")};
        color: black;
    }
`

export const StartStopButton = ({ desired, actual, onChange }: { desired: DesiredState; actual: MachineState; onChange: (DesiredState) => void }) => {
    const common_props = {
        icon: <PoweroffOutlined />,
        size: "small" as SizeType
    }
    const OnButton = (
        <StyledButton {...common_props} power={true} color="green" onClick={() => onChange(DesiredState.OPERATIONAL)}>
            Power On
        </StyledButton>
    )
    const OffButton = (
        <StyledButton {...common_props} power={false} color="red" onClick={() => onChange(DesiredState.STANDBY)}>
            Power Off
        </StyledButton>
    )
    const DisabledButton = (
        <Button {...common_props} color="red" disabled>
            Please wait...
        </Button>
    )

    if (actual === MachineState.FAULT || actual === MachineState.FAULT_REACTION_ACTIVE) {
        return DisabledButton
    }
    switch (desired) {
        case DesiredState.NONE:
            if (actual === MachineState.SWITCH_ON_DISABLED) {
                return OnButton
            }
            return OffButton
        case DesiredState.OPERATIONAL:
            return OffButton
        case DesiredState.STANDBY:
            return DisabledButton
        default:
            console.log("Unknown desired state: ", desired)
    }
    return null
}
