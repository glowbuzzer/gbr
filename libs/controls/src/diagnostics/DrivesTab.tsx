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
import { Button, Card, Divider, Flex, Tag, Tooltip } from "antd"
import styled from "styled-components"

import { toTableDataEmStatDrives } from "./emStatDrivesDictionary"
import { columns, StyledTable } from "./EmStatsUtils"
import { StyledToolTipDiv } from "../util/styles/StyledTileContent"

const StyledTag = styled(Tag)`
    display: inline-block;
    width: auto;
    text-align: center;
`

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
    }
`

type SafetyItemProps = {
    index: number
    config: GlowbuzzerConfig["safetyDin"][0]
    label?: string
}

/**
 * The safety diagnostics tile. Shows the overall safety state, acknowledgeable and unacknowledgeable faults, and FSoE status.
 */
export const DrivesTab = () => {
    const emstat = useEtherCATMasterStatus()

    const tableRef = React.useRef(null)

    const updatedTableData = toTableDataEmStatDrives(emstat)

    const getRowClassName = (record, index) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }
    const handleDownload = fileType => {
        // Implement your download logic here
        console.log(`Downloading ${fileType}`)
    }

    return (
        <>
            <Card title="Drives status" size="small">
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
            {/*<Card title="Download data from drives" size="small">*/}
            {/*    <Button*/}
            {/*        size="small"*/}
            {/*        style={{ marginRight: "10px" }}*/}
            {/*        type="primary"*/}
            {/*        onClick={() => handleDownload("Drive log files")}*/}
            {/*    >*/}
            {/*        Download Drive Log Files*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        size="small"*/}
            {/*        style={{ marginRight: "10px" }}*/}
            {/*        type="primary"*/}
            {/*        onClick={() => handleDownload("Drive config files")}*/}
            {/*    >*/}
            {/*        Download Drive Config Files*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        size="small"*/}
            {/*        type="primary"*/}
            {/*        onClick={() => handleDownload("Drive model files")}*/}
            {/*    >*/}
            {/*        Download Drive Model Files*/}
            {/*    </Button>*/}
            {/*</Card>*/}
        </>
    )
}
