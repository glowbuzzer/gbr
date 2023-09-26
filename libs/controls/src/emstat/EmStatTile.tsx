/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useEtherCATMasterStatus } from "@glowbuzzer/store"
import { Table } from "antd"

enum CIA_STATE {
    "CIA NOT READY TO SWITCH ON",
    "CIA SWITCH ON DISABLED",
    "CIA READY TO SWITCH ON",
    "CIA SWITCHED ON",
    "CIA OPERATION ENABLED",
    "CIA_QUICK STOP ACTIVE",
    "CIA FAULT REACTION ACTIVE",
    "CIA FAULT"
}

const EC_STATE = {
    0x0: "EC State: None",
    0x01: "EC State: Init",
    0x02: "EC State: Pre-op",
    0x03: "EC State: Boot",
    0x04: "EC State: Safe-op",
    0x08: "EC State: Operational",
    0x10: "EC State: Error Ack",
    0x11: "EC State: Init error active",
    0x12: "EC State: Pre-op error active",
    0x14: "EC State: Safe-op error active",
    0x18: "EC State: Op error active",
    0x20: "EC State: ?"
}
const EC_ALSTATUSCODE = {
    0x0000: "No error",
    0x0001: "Unspecified error",
    0x0002: "No memory",
    0x0011: "Invalid requested state change",
    0x0012: "Unknown requested state",
    0x0013: "Bootstrap not supported",
    0x0014: "No valid firmware",
    0x0015: "Invalid mailbox configuration",
    0x0016: "Invalid mailbox configuration",
    0x0017: "Invalid sync manager configuration",
    0x0018: "No valid inputs available",
    0x0019: "No valid outputs",
    0x001a: "Synchronization error",
    0x001b: "Sync manager watchdog",
    0x001c: "Invalid sync Manager types",
    0x001d: "Invalid output configuration",
    0x001e: "Invalid input configuration",
    0x001f: "Invalid watchdog configuration",
    0x0020: "Slave needs cold start",
    0x0021: "Slave needs INIT",
    0x0022: "Slave needs PREOP",
    0x0023: "Slave needs SAFEOP",
    0x0024: "Invalid input mapping",
    0x0025: "Invalid output mapping",
    0x0026: "Inconsistent settings",
    0x0027: "Freerun not supported",
    0x0028: "Synchronisation not supported",
    0x0029: "Freerun needs 3buffer mode",
    0x002a: "Background watchdog",
    0x002b: "No valid Inputs and Outputs",
    0x002c: "Fatal sync error",
    0x002d: "No sync error", // was "Invalid Output FMMU Configuration"
    0x002e: "Invalid input FMMU configuration",
    0x0030: "Invalid DC SYNC configuration",
    0x0031: "Invalid DC latch configuration",
    0x0032: "PLL error",
    0x0033: "DC sync IO error",
    0x0034: "DC sync timeout error",
    0x0035: "DC invalid sync cycle time",
    0x0036: "DC invalid sync0 cycle time",
    0x0037: "DC invalid sync1 cycle time",
    0x0041: "MBX_AOE",
    0x0042: "MBX_EOE",
    0x0043: "MBX_COE",
    0x0044: "MBX_FOE",
    0x0045: "MBX_SOE",
    0x004f: "MBX_VOE",
    0x0050: "EEPROM no access",
    0x0051: "EEPROM error",
    0x0060: "Slave restarted locally",
    0x0061: "Device identification value updated",
    0x00f0: "Application controller available",
    0xffff: "Unknown"
}

// function convert_state(key: string, value: number) {
//     if (!key.endsWith("state")) {
//         return value
//     }
//     return CIA_STATE[value]
// }

//Matches key endings to convert values to human readable
const possibleEndings = ["CIA state", "ALstatuscode", "Slave state", "(hex)"]

function convert_values(key: string, value: number | string | boolean, possibleEndings: string[]) {
    for (const ending of possibleEndings) {
        if (key.endsWith(ending)) {
            switch (ending) {
                case "CIA state":
                    return CIA_STATE[value as number]
                case "ALstatuscode":
                    return EC_ALSTATUSCODE[value as number]
                case "Slave state":
                    return EC_STATE[value as number]
                case "(hex)":
                    return "0x" + value.toString(16)
            }
        }
    }

    if (typeof value === "boolean") {
        if (value == false) {
            return "false"
        }
        if (value == true) {
            return "true"
        }
    }
    return value
}

function to_table_data(obj, parentKey = "") {
    const result = []

    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            const children = to_table_data(obj[key], key)
            result.push({
                key: parentKey + "/" + key,
                property: key,
                value: "",
                defaultExpanded: true,
                children
            })
        } else {
            result.push({
                key: parentKey + "/" + key,
                property: key,
                value: convert_values(key, obj[key], possibleEndings)
            })
        }
    }

    return result
}

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

//empty ->flase

export const EmStatTile = () => {
    const emstat = useEtherCATMasterStatus()
    const tableRef = React.useRef(null)
    const tableData = to_table_data(emstat)
    return (
        <Table
            ref={tableRef}
            columns={columns}
            dataSource={tableData}
            rowKey="key"
            size="small"
            expandable={{ defaultExpandAllRows: true }}
            pagination={false}
        />
    )
}
