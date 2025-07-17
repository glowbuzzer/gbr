/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ECM_CYCLIC_STATE, useEtherCATMasterStatus, useStepMasterStatus } from "@glowbuzzer/store"
import { columns } from "./EmStatsUtils"
import { toTableDataEmStat } from "./emStatDictionary"
import { EcmStateGuard } from "../util/components/EcmStateGuard"
import { Table } from "antd"

/**
 * EmStatTab component displays the EtherCAT Master status in a table format.
 *
 */
export const SmStatTab = () => {
    const smstat = useStepMasterStatus()

    const tableRef = React.useRef(null)

    const updatedTableData = toTableDataEmStat(smstat, "", {
        type: "object",
        children: {
            cs: {
                name: "Cyclic State",
                convert: v => {
                    return ECM_CYCLIC_STATE[v]
                }
            }
        }
    })

    const getRowClassName = (record: any) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }

    return (
        <Table
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
