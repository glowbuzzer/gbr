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
import { message, Table } from "antd"
import { to_table_data } from "./dictionary"

import styled from "styled-components"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { SaveOutlined } from "@ant-design/icons"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

const hexToRgb = hex =>
    hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
        .map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? "0" + hex : hex
        })
        .join("")

const lightenColor = (hex, factor) => {
    const [r, g, b] = hexToRgb(hex)
    const adjustedR = Math.round(r + (255 - r) * factor)
    const adjustedG = Math.round(g + (255 - g) * factor)
    const adjustedB = Math.round(b + (255 - b) * factor)

    return rgbToHex(adjustedR, adjustedG, adjustedB)
}

const StyledTable = styled(Table)`
    /* Add your styles here */

    .highlight-row {
        font-weight: bold;
            //background-color: ${props => props.theme.colorPrimary};


        background-color: ${props => lightenColor(props.theme.colorPrimary, 0.4)};
        /* Adjust the second parameter (0.2) to control the degree of lightening */
    }

    td {
        /* Adjust the padding or margin as needed */
        padding-left: 10px;
    }
}
`

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
    const machine = useMachine()

    const download_enabled =
        connected &&
        machine.target === MACHINETARGET.MACHINETARGET_FIELDBUS &&
        machine.currentState !== MachineState.OPERATION_ENABLED

    const tableRef = React.useRef(null)

    const updatedTableData = to_table_data(emstat)

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
