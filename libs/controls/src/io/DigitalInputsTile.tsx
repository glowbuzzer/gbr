/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    useDigitalInputList,
    useDigitalInputs,
    useDigitalInputState,
    useDigitalOutputState
} from "@glowbuzzer/store"
import { StyledTileContent, StyledToolTipDiv } from "../util/styles/StyledTileContent"
import { Select, Switch, Tag, Tooltip } from "antd"

import styled from "styled-components"

const { Option } = Select

const StyledDinDiv = styled.div`
    /* Target the outer tooltip wrapper when the tooltip is placed at the top */
    //position: relative;
    //display: inline-block; // Ensures inline behavior which is crucial for tooltips

    .ant-tooltip-placement-top > .ant-tooltip-content {
        margin-bottom: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-bottom > .ant-tooltip-content {
        margin-top: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-right > .ant-tooltip-content {
        margin-left: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-placement-left > .ant-tooltip-content {
        margin-right: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }
`

export const StyledDigitalInputs = styled.div`
    > div {
        display: flex;
        gap: 10px;
    }

    .din-label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

const DigitalInputItem = ({
    index,
    label,
    description
}: {
    index: number
    label?: string
    description: string
}) => {
    const [din, setDin] = useDigitalInputState(index)

    function handle_override_change(value) {
        setDin(din.override, value)
    }

    function handle_state_change() {
        const new_state = !din.setValue
        setDin(new_state, din.override)
    }

    return (
        <StyledDinDiv>
            <Tooltip
                title={description}
                placement="top"
                mouseEnterDelay={2}
                getPopupContainer={triggerNode => triggerNode}
            >
                <div className="din-label">{label || "Unknown"}</div>
            </Tooltip>

            <div>
                <Select
                    size="small"
                    value={din.override ? 1 : 0}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!din.override}
                checked={din.setValue}
                onChange={handle_state_change}
            />

            <div>
                <Tag color={din.actValue ? "green" : "red"}>{din.actValue ? "ON" : "OFF"}</Tag>
            </div>
        </StyledDinDiv>
    )
}

type DigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital inputs tile shows a simple view of all current digital input values.
 */
export const DigitalInputsTile = ({ labels = [] }: DigitalInputsTileProps) => {
    const dins = useDigitalInputList()

    return (
        <StyledTileContent>
            <StyledDigitalInputs>
                {dins?.map((config, index) => (
                    <DigitalInputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                        description={config.description}
                    />
                ))}
            </StyledDigitalInputs>
        </StyledTileContent>
    )
}
