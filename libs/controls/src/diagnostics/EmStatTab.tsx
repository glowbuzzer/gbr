/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    MachineState,
    MACHINETARGET,
    useConnection,
    useEtherCATMasterStatus,
    useMachine
} from "@glowbuzzer/store"
import { message, Table, TabsProps } from "antd"

import styled from "styled-components"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { SaveOutlined } from "@ant-design/icons"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { columns, lightenColor, StyledTable } from "./EmStatsUtils"
import { toTableDataEmStat } from "./emStatDictionary"

function isBitSet(number: number, bitPosition: number): boolean {
    const mask = 1 << bitPosition
    return (number & mask) !== 0
}

/**
 * EmStatTab component displays the EtherCAT Master status in a table format.
 *
 */
export const EmStatTab = () => {
    const emstat = useEtherCATMasterStatus()
    const [messageApi, messageContext] = message.useMessage()

    const { connected, request } = useConnection()
    const machine = useMachine()

    const download_enabled =
        connected &&
        machine.target === MACHINETARGET.MACHINETARGET_FIELDBUS &&
        machine.currentState !== MachineState.OPERATION_ENABLED

    const tableRef = React.useRef(null)

    const updatedTableData = toTableDataEmStat(emstat)

    const getRowClassName = (record, index) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }

    async function download_drive_logs() {
        await request("download drive logs", { enable: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await request("download drive logs", { enable: false })
        messageApi.success("Drive logs download triggered")
    }

    return (
        <>
            {messageContext}
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        useFill
                        Icon={SaveOutlined}
                        button
                        disabled={!download_enabled}
                        onClick={download_drive_logs}
                        title="Download Drive Logs"
                    />
                </DockToolbarButtonGroup>
            </DockToolbar>
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
        </>
    )
}
