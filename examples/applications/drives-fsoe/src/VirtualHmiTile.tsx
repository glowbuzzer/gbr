import { useSafetyDigitalInputState } from "@glowbuzzer/store"

import { Button, Switch, Tag } from "antd"
import styled from "styled-components"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"
import { useEffect } from "react"

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 5fr 1fr 2fr; // Define grid layout for all rows
    gap: 10px;
`

const SafetyDigitalInputToggle = ({
    index,
    label,
    onLabel = "ON",
    offLabel = "OFF"
}: {
    index: number
    label: string
    onLabel?: string
    offLabel?: string
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    useEffect(() => {
        // Ensure override is always set to true
        if (!din.override) {
            setDin(din.setValue, true)
        }
    }, [din.override, din.setValue, setDin])

    function handle_state_change() {
        const new_state = !din.setValue
        setDin(new_state, din.override)
    }

    return (
        <>
            <div className="label">{label}</div>
            <div className="switch-wrapper">
                <Switch checked={din.setValue} onChange={handle_state_change} size="small" />
            </div>
            <div className="tag-wrapper">
                <Tag>{din.actValue ? onLabel : offLabel}</Tag>
            </div>
        </>
    )
}

const SafetyDigitalInputPushButton = ({
    index,
    label,
    onLabel = "ON",
    offLabel = "OFF"
}: {
    index: number
    label: string
    onLabel?: string
    offLabel?: string
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    function handle_click() {
        // Set override and state to true for 1 second, then reset both
        setDin(true, true)
        setTimeout(() => setDin(false, false), 1000)
    }

    return (
        <>
            <div className="label">{label}</div>
            <div className="button-wrapper">
                <Button onClick={handle_click} size="small">
                    Push
                </Button>
            </div>
            <div className="tag-wrapper">
                <Tag>{din.actValue ? onLabel : offLabel}</Tag>
            </div>
        </>
    )
}

export const VirtualHmiTile = () => {
    return (
        <StyledTileContent>
            <StyledDiv>
                <SafetyDigitalInputToggle
                    index={1}
                    label="Override"
                    onLabel="OVERIDDEN"
                    offLabel={"NO OVERRIDE"}
                />
                <SafetyDigitalInputToggle index={2} label="Mode" onLabel="AUTO" offLabel="MANUAL" />
                <SafetyDigitalInputPushButton
                    index={3}
                    label="Reset"
                    offLabel="NO RESET"
                    onLabel="RESTTING"
                />
                <SafetyDigitalInputToggle
                    index={4}
                    label="Enabling switch"
                    onLabel="ENABLED"
                    offLabel="DISABLED"
                />
                <SafetyDigitalInputToggle
                    index={5}
                    label="Yellow zone"
                    onLabel="TRIGGERED"
                    offLabel="NOT TRIGGERED"
                />
                <SafetyDigitalInputToggle
                    index={6}
                    label="Red zone"
                    onLabel="TRIGGERED"
                    offLabel="NOT TRIGGERED"
                />
            </StyledDiv>
        </StyledTileContent>
    )
}
