/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import { Tile } from "@glowbuzzer/controls"
import {
    SpindleConfig,
    useAnalogOutputState,
    useConfig,
    useDigitalOutputState
} from "@glowbuzzer/store"
import { Button, Checkbox, Input, Radio, Space } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding-bottom: 10px;

    .title {
        font-weight: bold;
        padding-bottom: 4px;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .ant-input.updated {
        color: green;
        border-color: green;
    }
`

const SpindleItem = ({ spindleConfig, index }: { spindleConfig: SpindleConfig; index: number }) => {
    const [enabled, setEnabled] = useDigitalOutputState(spindleConfig.enableDigitalOutIndex)
    const [speed, setSpeed] = useAnalogOutputState(spindleConfig.speedAnalogOutIndex)
    const [direction, setDirection] = useDigitalOutputState(spindleConfig.directionDigitalOutIndex)
    const [speedValue, setSpeedValue] = useState(0)

    // only treat as in override mode if all outputs are in override mode
    const override = enabled.override && speed.override && direction.override
    const cw = spindleConfig.directionInvert ? !direction.setValue : direction.setValue

    useEffect(() => {
        setSpeedValue(speed.setValue)
    }, [speed.setValue])

    function toggle_override() {
        setEnabled(enabled.effectiveValue, !override)
        setSpeed(speed.setValue, !override)
        setDirection(direction.setValue, !override)
    }

    function toggle_enabled() {
        setEnabled(!enabled.setValue, override)
    }

    function toggle_direction() {
        setDirection(!direction.setValue, override)
    }

    function set_speed(e) {
        setSpeedValue(e.target.value)
    }

    return (
        <StyledDiv>
            <div className="title">{spindleConfig.name}</div>
            <div className="form">
                <div>
                    <Checkbox checked={override} onChange={toggle_override}>
                        Take manual control of spindle
                    </Checkbox>
                </div>
                <Space>
                    <Radio.Group
                        value={enabled.effectiveValue}
                        onChange={toggle_enabled}
                        disabled={!enabled.override}
                    >
                        <Radio.Button value={false}>OFF</Radio.Button>
                        <Radio.Button value={true}>ON</Radio.Button>
                    </Radio.Group>
                    <Radio.Group
                        value={cw}
                        onChange={toggle_direction}
                        disabled={!direction.override}
                    >
                        <Radio.Button value={true}>CW</Radio.Button>
                        <Radio.Button value={false}>CCW</Radio.Button>
                    </Radio.Group>
                </Space>
                <div>
                    <Space>
                        <Input
                            className={
                                speed.override && speedValue == speed.setValue
                                    ? "updated"
                                    : undefined
                            }
                            type="number"
                            value={speedValue}
                            onChange={set_speed}
                            disabled={!speed.override}
                        />
                        <Button
                            onClick={() => setSpeed(speedValue, override)}
                            disabled={!speed.override || speedValue == speed.setValue}
                        >
                            Set Speed
                        </Button>
                    </Space>
                </div>
            </div>
        </StyledDiv>
    )
}

/**
 * The spindle tile allows you to view and control all spindles configured on a machine.
 *
 * @constructor
 */
export const SpindleTile = () => {
    const spindles = useConfig().spindle

    return (
        <Tile title={"Spindle"}>
            {spindles?.map((spindleConfig, index) => (
                <SpindleItem key={index} spindleConfig={spindleConfig} index={index} />
            ))}
        </Tile>
    )
}
