/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { FAULT_CAUSE, useEtherCATMasterStatus, useMachine } from "@glowbuzzer/store"
import { Table } from "antd"
import { to_table_data_new } from "./dictionary"
import { filter_fault_causes } from "../util/faults"
import styled from "styled-components"

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
    const machine = useMachine()

    // if (isBitSet(machine.statusWord, 12)) {
    //     return (
    //         <div>
    //             <h1>Machine is in fault</h1>
    //         </div>
    //     )
    // }

    const tableRef = React.useRef(null)
    // const tableData = to_table_data(emstat)

    // const activeFaultArray = filter_fault_causes(machine.activeFault)
    // const activeFaultString = activeFaultArray.map(item => `${item.description}`).join(", ")
    //
    // const historicFaultArray = filter_fault_causes(machine.faultHistory)
    // const historicFaultString = historicFaultArray.map(item => `${item.description}`).join(", ")

    // const extraData = [
    //     {
    //         key: "/Homing required",
    //         property: "Homing required",
    //         value: "true"
    //     },
    //     {
    //         key: "/Active fault",
    //         property: "Active fault",
    //         value: activeFaultString || "No fault"
    //     },
    //     {
    //         key: "/Historic fault",
    //         property: "Historic fault",
    //         value: historicFaultString || "No fault"
    //     }
    // ]

    // const updatedTableData = [...tableData, ...extraData]
    const updatedTableData = to_table_data_new(emstat)

    const getRowClassName = (record, index) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }

    // console.log(updatedTableData)

    return (
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
    )
}
