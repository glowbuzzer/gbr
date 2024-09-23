/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    GlowbuzzerConfig,
    configMetadata,
    useOverallSafetyStateInput,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs,
    useEtherCATMasterStatus,
    useSafetyDigitalInputState
} from "@glowbuzzer/store"
import { Card, Divider, Flex, Tag, Tooltip } from "antd"
import styled from "styled-components"
import { SafetyTabContent } from "./SafetyTabContent"
import { toTableDataEmStatSafety } from "./emStatSafetyDictionary"
import { columns, StyledTable } from "./EmStatsUtils"
import { StyledToolTipDiv } from "../util/styles/StyledTileContent"
import { EcmStateGuard } from "../util/components/EcmStateGuard"

const StyledTag = styled(Tag)`
    display: inline-block;
    width: auto;
    text-align: center;
`

const StyledDiv = styled.div`
    padding: 5px;

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
    }
`

type SafetyItemProps = {
    index: number
    config: GlowbuzzerConfig["safetyDin"][0]
    label?: string
}

type SafetyInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

const SafetyItem: React.FC<SafetyItemProps> = ({ index, config, label }) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    const description = config.description
    const state = din.actValue
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

            <StyledTag color={active_state_color}>{active_state_label}</StyledTag>

            {/*</div>*/}
        </React.Fragment>
    )
}

/**
 * The safety diagnostics tile. Shows the overall safety state, acknowledgeable and unacknowledgeable faults, and FSoE status.
 */
export const SafetyTab = ({ labels = [] }: SafetyInputsTileProps) => {
    // const safetyDins = useSafetyDigitalInputList()
    // const safetyValues = useSafetyDigitalInputs()
    const overallSafetyState = useOverallSafetyStateInput()

    const dins = useSafetyDigitalInputList()

    const acknowledgeableFaults = dins
        ?.map((s, index) => ({
            ...s,
            originalIndex: index
        }))
        .filter(s => configMetadata(s).type === "acknowledgeable")

    const unacknowledgeableFaults = dins
        ?.map((s, index) => ({
            ...s,
            originalIndex: index
        }))
        .filter(s => configMetadata(s).type === "unacknowledgeable")

    const emstat = useEtherCATMasterStatus()

    const tableRef = React.useRef(null)

    const updatedTableData = toTableDataEmStatSafety(emstat)

    const getRowClassName = (record, index) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }

    return (
        <SafetyTabContent>
            <EcmStateGuard requireCyclicRunning>
                <Flex vertical gap="small">
                    <Card
                        bordered={false}
                        title="Overall Safety State"
                        size="small"
                        extra={
                            <StyledTag color={overallSafetyState ? "green" : "red"}>
                                {overallSafetyState ? "NO FAULT" : "FAULT"}
                            </StyledTag>
                        }
                    />

                    <Card bordered={false} title="Acknowledgeable Safety Faults" size="small">
                        <StyledDiv>
                            <div className="safety-grid">
                                {acknowledgeableFaults?.map(config => {
                                    return (
                                        <SafetyItem
                                            key={config.originalIndex}
                                            index={config.originalIndex}
                                            config={config}
                                            label={
                                                labels[config.originalIndex] ||
                                                config.name ||
                                                config.originalIndex.toString()
                                            }
                                        />
                                    )
                                })}
                            </div>
                        </StyledDiv>
                    </Card>

                    <Card bordered={false} title="Unacknowledgeable Safety Faults" size="small">
                        <StyledDiv>
                            <div className="safety-grid">
                                {unacknowledgeableFaults?.map(config => {
                                    return (
                                        <SafetyItem
                                            key={config.originalIndex}
                                            index={config.originalIndex}
                                            config={config}
                                            label={
                                                labels[config.originalIndex] ||
                                                config.name ||
                                                config.originalIndex.toString()
                                            }
                                        />
                                    )
                                })}
                            </div>
                        </StyledDiv>
                    </Card>

                    <Card bordered={false} title="FSoE status diagnostic" size="small">
                        <StyledTable
                            ref={tableRef}
                            rowClassName={getRowClassName}
                            columns={columns}
                            dataSource={updatedTableData}
                            rowKey="key"
                            size="small"
                            expandable={{ defaultExpandAllRows: true }}
                            pagination={false}
                            showHeader={false}
                        />
                    </Card>
                </Flex>
            </EcmStateGuard>
        </SafetyTabContent>
    )
}
