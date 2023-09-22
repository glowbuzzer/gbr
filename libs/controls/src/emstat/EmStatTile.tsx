/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useEtherCATMasterStatus } from "@glowbuzzer/store"
import { Table } from "antd"

enum CIA_STATE {
    CIA_NOT_READY_TO_SWITCH_ON,
    CIA_SWITCH_ON_DISABLED,
    CIA_READY_TO_SWITCH_ON,
    CIA_SWITCHED_ON,
    CIA_OPERATION_ENABLED,
    CIA_QUICK_STOP_ACTIVE,
    CIA_FAULT_REACTION_ACTIVE,
    CIA_FAULT
}

function convert_state(key: string, value: number) {
    if (!key.endsWith("state")) {
        return value
    }
    return CIA_STATE[value]
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
                value: convert_state(key, obj[key])
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
