/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { FAULT_CAUSE, useConnection, useEtherCATMasterStatus, useMachine } from "@glowbuzzer/store"
import { message, Table } from "antd"
import { to_table_data } from "./dictionary"
import { filter_fault_causes } from "../util/faults"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import Icon from "antd/es/icon"
import { SaveOutlined } from "@ant-design/icons"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

const columns = [
    {
        title: "Property",
        dataIndex: "property",
        key: "property"
    },
    {
        title: "Value",
        dataIndex: "value",
        key: "value"
    }
]

function isBitSet(number: number, bitPosition: number): boolean {
    const mask = 1 << bitPosition
    return (number & mask) !== 0
}

export const EmStatTile = () => {
    const emstat = useEtherCATMasterStatus()
    const [messageApi, messageContext] = message.useMessage()

    const { connected, request } = useConnection()

    const tableRef = React.useRef(null)

    const updatedTableData = to_table_data(emstat)

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
                        disabled={!connected}
                        onClick={download_drive_logs}
                        title="Download Drive Logs"
                    />
                </DockToolbarButtonGroup>
            </DockToolbar>
            <Table
                ref={tableRef}
                columns={columns}
                dataSource={updatedTableData}
                rowKey="key"
                size="small"
                expandable={{ defaultExpandAllRows: true }}
                pagination={false}
            />
        </>
    )
}
