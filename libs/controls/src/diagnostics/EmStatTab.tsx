/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useEtherCATMasterStatus } from "@glowbuzzer/store"
import { columns } from "./EmStatsUtils"
import { toTableDataEmStat } from "./emStatDictionary"
import { EcmStateGuard } from "../util/components/EcmStateGuard"
import { Table } from "antd"

/**
 * EmStatTab component displays the EtherCAT Master status in a table format.
 *
 */
export const EmStatTab = () => {
    const emstat = useEtherCATMasterStatus()

    const tableRef = React.useRef(null)

    const updatedTableData = toTableDataEmStat(emstat)

    const getRowClassName = (record: any) => {
        return record.key.endsWith("_se") ? "highlight-row" : "normal"
    }

    return (
        <EcmStateGuard requireCyclicRunning={false}>
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
        </EcmStateGuard>
    )
}
