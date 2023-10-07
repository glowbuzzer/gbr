/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { FaultCode, useEtherCATMasterStatus, useMachine } from "@glowbuzzer/store"
import { Table } from "antd"
import { CIA_STATE, EC_STATE, EC_ALSTATUSCODE, to_table_data_new } from "./dictionary"

// function convert_state(key: string, value: number) {
//     if (!key.endsWith("state")) {
//         return value
//     }
//     return CIA_STATE[value]
// }

// //Matches key endings to convert values to human readable
// const possibleEndings = ["CIA state", "ALstatuscode", "Slave state", "(hex)"]
//
// function convert_values(key: string, value: number | string | boolean, possibleEndings: string[]) {
//     for (const ending of possibleEndings) {
//         if (key.endsWith(ending)) {
//             switch (ending) {
//                 case "CIA state":
//                     return CIA_STATE[value as number]
//                 case "ALstatuscode":
//                     return EC_ALSTATUSCODE[value as number]
//                 case "Slave state":
//                     return EC_STATE[value as number]
//                 case "(hex)":
//                     return "0x" + value.toString(16)
//             }
//         }
//     }
//
//     //slave errors look like: "Time:1696018381.825 SDO slave:4 index:9999.00 error:06020000 The object does not exist in the object directory"
//     //search for "Time:" and replace the timestamp with a human readable date/time
//     if (typeof value === "string" && value.includes("Time:")) {
//         const timestampRegex = /Time:(\d+\.\d+)/
//         const match = value.match(timestampRegex)
//
//         if (match) {
//             const timestamp = parseFloat(match[1])
//             const newDate = new Date()
//             newDate.setTime(timestamp * 1000)
//             const dateString = newDate.toUTCString()
//             value = value.replace(timestampRegex, dateString)
//         }
//     }
//
//     if (typeof value === "boolean") {
//         if (value == false) {
//             return "false"
//         }
//         if (value == true) {
//             return "true"
//         }
//     }
//     return value
// }
//
// function to_table_data(obj, parentKey = "") {
//     const result = []
//
//     for (const key in obj) {
//         if (typeof obj[key] === "object" && obj[key] !== null) {
//             const children = to_table_data(obj[key], key)
//             result.push({
//                 key: parentKey + "/" + key,
//                 property: key,
//                 value: "",
//                 defaultExpanded: true,
//                 children
//             })
//         } else {
//             result.push({
//                 key: parentKey + "/" + key,
//                 property: key,
//                 value: convert_values(key, obj[key], possibleEndings)
//             })
//         }
//     }
//
//     return result
// }

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

    const activeFaultArray = Object.values(FaultCode)
        .filter(k => typeof k === "number")
        .filter((k: number) => machine.activeFault & k)
        .map(k => ({
            code: k,
            description: FaultCode[k].substring("FAULT_CAUSE_".length)
        }))

    const activeFaultString = activeFaultArray.map(item => `${item.description}`).join(", ")

    const historicFaultArray = Object.values(FaultCode)
        .filter(k => typeof k === "number")
        .filter((k: number) => machine.faultHistory & k)
        .map(k => ({
            code: k,
            description: FaultCode[k].substring("FAULT_CAUSE_".length)
        }))

    const historicFaultString = historicFaultArray.map(item => `${item.description}`).join(", ")

    const extraData = [
        {
            key: "/Homing required",
            property: "Homing required",
            value: "true"
        },
        {
            key: "/Active fault",
            property: "Active fault",
            value: activeFaultString || "No fault"
        },
        {
            key: "/Historic fault",
            property: "Historic fault",
            value: historicFaultString || "No fault"
        }
    ]

    // const updatedTableData = [...tableData, ...extraData]
    const updatedTableData = to_table_data_new(emstat)

    console.log(emstat)

    return (
        <Table
            ref={tableRef}
            columns={columns}
            dataSource={updatedTableData}
            rowKey="key"
            size="small"
            expandable={{ defaultExpandAllRows: true }}
            pagination={false}
        />
    )
}
