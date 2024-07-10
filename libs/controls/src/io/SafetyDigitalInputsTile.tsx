/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    GlowbuzzerConfig,
    SafetyIoMetadata,
    useSafetyDigitalInputList,
    useSafetyDigitalInputState
} from "@glowbuzzer/store"
import {
    // StyledSafetyDigitalInputs,
    // StyledSafetyDigitalInputsRow,
    StyledToolTipDiv
} from "../util/styles/StyledTileContent"
import { Select, Switch, Tag, Tooltip } from "antd"
import { SafetyTileContent } from "./SafetyTileContent"

const { Option } = Select

const SafetyDigitalInputItem = ({
    index,
    config,
    label
}: {
    index: number
    config: GlowbuzzerConfig["safetyDin"][0]
    label?: string
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    const description = config.description
    const state = din.actValue
    const numeric_state = state ? 1 : 0

    const metadata: SafetyIoMetadata = config.$metadata
    const { active_state_label, active_state_color } = metadata
        ? {
              active_state_label: metadata[numeric_state],
              active_state_color: numeric_state == metadata.negativeState ? "red" : "green"
          }
        : {
              active_state_label: state ? "ON" : "OFF",
              active_state_color: state ? "green" : "red"
          }

    function handle_override_change(value: boolean) {
        setDin(din.override, value)
    }

    function handle_state_change() {
        const new_state = !din.setValue
        setDin(new_state, din.override)
    }

    return (
        <React.Fragment>
            <StyledToolTipDiv>
                <Tooltip
                    title={label}
                    placement="top"
                    mouseEnterDelay={2}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div className="din-label">{description || "Unknown"}</div>
                </Tooltip>
            </StyledToolTipDiv>
            <div>
                <Select
                    size="small"
                    value={din.override}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={false}>Auto</Option>
                    <Option value={true}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!din.override}
                checked={din.setValue}
                onChange={handle_state_change}
            />
            <div className="label">
                <Tag color={active_state_color}>{active_state_label}</Tag>
            </div>
        </React.Fragment>
    )
}

type SafetyDigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The safety digital inputs tile shows a simple view of all current digital input values.
 */
export const SafetyDigitalInputsTile = ({ labels = [] }: SafetyDigitalInputsTileProps) => {
    const dins = useSafetyDigitalInputList()

    return (
        <SafetyTileContent>
            <div className="grid">
                {dins?.map((config, index) => {
                    return (
                        <SafetyDigitalInputItem
                            key={index}
                            index={index}
                            config={config}
                            label={labels[index] || config.name || index.toString()}
                        />
                    )
                })}
            </div>
        </SafetyTileContent>
    )
}
