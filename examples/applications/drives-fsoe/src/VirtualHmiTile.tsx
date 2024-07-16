import { useSafetyDigitalInputState } from "@glowbuzzer/store"
import { Button, Switch, Tag, Card } from "antd"
import styled from "styled-components"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"
import { useEffect, useState } from "react"

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 5fr 1fr 2fr; // Define grid layout for all rows
    gap: 10px;
`

const SafetyDigitalInputToggle = ({
    index,
    label,
    onLabel = "ON",
    offLabel = "OFF",
    disabled
}: {
    index: number
    label: string
    onLabel?: string
    offLabel?: string
    disabled: boolean
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    useEffect(() => {
        if (!disabled) {
            // Ensure override is always set to true
            if (!din.override) {
                setDin(din.setValue, true)
            }
        }
    }, [din.override, din.setValue, setDin, disabled])

    useEffect(() => {
        if (disabled) {
            // Remove override when functionality is disabled
            setDin(din.setValue, false)
        }
    }, [disabled, din.setValue, setDin])

    function handle_state_change() {
        if (!disabled) {
            const new_state = !din.setValue
            setDin(new_state, din.override)
        }
    }

    return (
        <>
            <div className="label">{label}</div>
            <div className="switch-wrapper">
                <Switch
                    checked={din.setValue}
                    onChange={handle_state_change}
                    size="small"
                    disabled={disabled}
                />
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
    offLabel = "OFF",
    disabled
}: {
    index: number
    label: string
    onLabel?: string
    offLabel?: string
    disabled: boolean
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    function handle_click() {
        if (disabled) {
            return
        }
        // Set override and state to true for 1 second, then reset both
        setDin(true, true)
        setTimeout(() => setDin(false, false), 1000)
    }

    return (
        <>
            <div className="label">{label}</div>
            <div className="button-wrapper">
                <Button onClick={handle_click} size="small" disabled={disabled}>
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
    const [enabled, setEnabled] = useState(false)

    const handle_enable_toggle = checked => {
        setEnabled(checked)
    }
    return (
        <StyledTileContent>
            <Card size="small" title="Enable/Disable Virtual HMI Functionality">
                <div style={{ marginBottom: "10px" }}>
                    <Switch
                        style={{ marginRight: "10px" }}
                        checked={enabled}
                        onChange={handle_enable_toggle}
                        size="small"
                    />
                    {enabled ? "Enabled" : "Disabled"}
                </div>
            </Card>
            <Card size="small" title="Controls for Virtual HMI Functionality">
                <StyledDiv>
                    <SafetyDigitalInputToggle
                        index={4}
                        label="Override"
                        onLabel="OVERIDDEN"
                        offLabel={"NO OVERRIDE"}
                        disabled={!enabled}
                    />
                    <SafetyDigitalInputToggle
                        index={6}
                        label="Mode"
                        onLabel="AUTO"
                        offLabel="MANUAL"
                        disabled={!enabled}
                    />
                    <SafetyDigitalInputToggle
                        index={8}
                        label="Enabling switch"
                        onLabel="ENABLED"
                        offLabel="DISABLED"
                        disabled={!enabled}
                    />
                    <SafetyDigitalInputToggle
                        index={2}
                        label="Yellow zone"
                        onLabel="TRIGGERED"
                        offLabel="NOT TRIGGERED"
                        disabled={!enabled}
                    />
                    <SafetyDigitalInputToggle
                        index={3}
                        label="Red zone"
                        onLabel="TRIGGERED"
                        offLabel="NOT TRIGGERED"
                        disabled={!enabled}
                    />
                </StyledDiv>
            </Card>
        </StyledTileContent>
    )
}
