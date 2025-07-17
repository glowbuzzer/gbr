/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ECM_CYCLIC_STATE, useEtherCATMasterStatus, useStepMasterStatus } from "@glowbuzzer/store"
import { columns } from "./EmStatsUtils"
import {
    BoolToString,
    CiaCommandToString,
    CiaStateToString,
    toTableDataEmStat
} from "./emStatDictionary"
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
            bs: {
                type: "object",
                name: "Boot State",
                children: {
                    init_done: {
                        name: "Init Done",
                        convert: BoolToString
                    },
                    io_initialised: {
                        name: "IO Initialised",
                        convert: BoolToString
                    },
                    all_drives_initialised: {
                        name: "All Drives Initialised",
                        convert: BoolToString
                    },
                    all_drives_configured: {
                        name: "All Drives Configured",
                        convert: BoolToString
                    },
                    all_drives_homed: {
                        name: "All Drives Homed",
                        convert: BoolToString
                    },
                    all_drives_operational: {
                        name: "All Drives Operational",
                        convert: BoolToString
                    },
                    boot_successful: {
                        name: "Boot Successful",
                        convert: BoolToString
                    }
                }
            },
            cycle_count: {
                name: "Cycle Count"
            },
            drive_count: {
                name: "Drive Count"
            },
            gbc_connected: {
                name: "GB Connected",
                convert: BoolToString
            },
            shared_mem_busy_count: {
                name: "Shared Memory Busy Count"
            },
            machine_state: {
                name: "Machine State",
                convert: CiaStateToString
            },
            Drives: {
                type: "array",
                name: "Drives",
                children: {
                    c: {
                        name: "Command",
                        convert: CiaCommandToString
                    },
                    s: {
                        name: "State",
                        convert: CiaStateToString
                    },
                    af: {
                        name: "Active Fault"
                    }
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
