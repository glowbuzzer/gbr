/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    GlowbuzzerConfig,
    useOverallSafetyStateInput,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs
} from "@glowbuzzer/store"
import { Tag } from "antd"
import styled from "styled-components"
import { SafetyTabContent } from "./SafetyTabContent"

const StyledDiv = styled.div`
    .safety-grid {
        display: grid;
        grid-template-columns: 5fr 1fr;
        gap: 5px;
        align-items: center;
        padding-bottom: 10px;

        header {
            padding-top: 10px;
            grid-column: span 2;
        }

        .label {
            color: ${props => props.theme.colorTextSecondary};
        }

        .ant-tag {
            width: 100%;
            text-align: center;
        }
    }
`

type SafetyItemProps = {
    label: string
    config: GlowbuzzerConfig["safetyDin"][0]
    state: boolean
}

const SafetyItem = ({ label, config, state }: SafetyItemProps) => {
    const metadata = config.$metadata
    const description = config.description || label
    const numeric_state = state ? 1 : 0

    const { active_state_label, active_state_color } = metadata
        ? {
              active_state_label: metadata[numeric_state],
              active_state_color: numeric_state == metadata.negativeState ? "red" : "green"
          }
        : {
              active_state_label: state ? "ON" : "OFF",
              active_state_color: state ? "green" : "red"
          }

    return (
        <React.Fragment>
            <div className="label">{description}</div>
            <div>
                <Tag color={active_state_color}>{active_state_label}</Tag>
            </div>
        </React.Fragment>
    )
}

type SafetyInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The safety tile
 */
export const SafetyTab = ({ labels = [] }: SafetyInputsTileProps) => {
    const safetyDins = useSafetyDigitalInputList()
    const safetyValues = useSafetyDigitalInputs()
    const overallSafetyState = useOverallSafetyStateInput()

    const normalised_labels = safetyDins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )

    const acknowledgeableFaults = safetyDins?.filter(s => s.$metadata?.type === "acknowledgeable")
    const unacknowledgeableFaults = safetyDins?.filter(
        s => s.$metadata?.type === "unacknowledgeable"
    )

    return (
        <SafetyTabContent>
            <StyledDiv>
                <div className="safety-grid">
                    <>
                        Overall safety state
                        <Tag color={overallSafetyState ? "green" : "red"}>
                            {overallSafetyState ? "NO FAULT" : "FAULT"}
                        </Tag>
                    </>
                    {acknowledgeableFaults.length > 0 && (
                        <>
                            <header>Acknowledgeable safety faults</header>
                            {acknowledgeableFaults.map((s, index) => (
                                <SafetyItem
                                    key={index}
                                    label={normalised_labels[index]}
                                    state={safetyValues[index]}
                                    config={s}
                                />
                            ))}
                        </>
                    )}
                    {unacknowledgeableFaults.length > 0 && (
                        <>
                            <header>Unacknowledgeable safety faults</header>
                            {unacknowledgeableFaults.map((s, index) => (
                                <SafetyItem
                                    key={index}
                                    label={normalised_labels[index]}
                                    state={safetyValues[index]}
                                    config={s}
                                />
                            ))}
                        </>
                    )}
                </div>
                Acknowledgeable safety faults can we reset using the reset button. Unacknowledgeable
                safety faults require?.
                {/*{safetyDins[safePosValidIndex] ? (*/}
                {/*    <div>*/}
                {/*        The robot is reporting that its safe position is valid. No action is needed.*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <div>*/}
                {/*        The robot is reporting that its safe position is INVALID. The safe position*/}
                {/*        homing routine must be run.{" "}*/}
                {/*    </div>*/}
                {/*)}*/}
            </StyledDiv>
        </SafetyTabContent>
    )
}
