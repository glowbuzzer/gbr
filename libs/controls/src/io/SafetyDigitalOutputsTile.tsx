/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Select, Switch, Tag, Tooltip } from "antd"
import {
    configMetadata,
    GlowbuzzerConfig,
    SafetyIoMetadata,
    useSafetyDigitalOutputList,
    useSafetyDigitalOutputState
} from "@glowbuzzer/store"
import { SafetyTileContent } from "./SafetyTileContent"

const { Option } = Select

const DigitalOutputItem = ({
    index,
    config,
    label
}: {
    index: number
    config: GlowbuzzerConfig["safetyDout"][0]
    label?: string
}) => {
    const [dout, setDout] = useSafetyDigitalOutputState(index)

    const description = config.description
    const state = dout.effectiveValue
    const numeric_state = state ? 1 : 0

    const metadata = configMetadata(config, true)
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
        setDout(dout.override, value)
    }

    function handle_state_change() {
        const new_state = !dout.setValue
        setDout(new_state, dout.override)
    }

    return (
        <React.Fragment>
            <Tooltip
                title={label}
                placement="top"
                mouseEnterDelay={2}
                getPopupContainer={triggerNode => triggerNode}
            >
                <div className="dout-label">{description || "Unknown"}</div>
            </Tooltip>
            <div>
                <Select
                    size="small"
                    value={dout.override}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={false}>Auto</Option>
                    <Option value={true}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!dout.override}
                checked={dout.setValue}
                onChange={handle_state_change}
            />
            <div>
                <Tag color={active_state_color}>{active_state_label}</Tag>
            </div>
        </React.Fragment>
    )
}

type SafetyDigitalOutputsTileProps = {
    /**
     * Override labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital outputs tile allows you to view and control all digital outputs on a machine.
 *
 * By default (in auto mode) digital outputs are controlled by activities, either using the solo activity API
 * or streamed (for example, using G-code M200). However this tile (and the underlying hook) allows
 * you to override an digital output. When an digital output is overridden, the value you specify will
 * be used regardless of any changes from an activity. For example, if you execute some G-code with
 * an M201 code, but have overridden an digital output using this tile, the M200 code will be ignored.
 *
 */
export const SafetyDigitalOutputsTile = ({ labels = [] }: SafetyDigitalOutputsTileProps) => {
    const douts = useSafetyDigitalOutputList()

    return (
        <SafetyTileContent>
            <div className="grid">
                {douts?.map((config, index) => {
                    return (
                        <DigitalOutputItem
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
