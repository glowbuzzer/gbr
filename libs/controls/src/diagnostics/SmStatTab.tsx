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
                        name: "Active Fault",
                        convert: BoolToString
                    },
                    hf: {
                        name: "Historic Fault",
                        convert: BoolToString
                    },
                    as: {
                        name: "Active stall",
                        convert: BoolToString
                    },
                    hss: {
                        name: "Historic stop on stall",
                        convert: BoolToString
                    },
                    ae: {
                        name: "Active encoder failure",
                        convert: BoolToString
                    },
                    he: {
                        name: "Historic encoder failure",
                        convert: BoolToString
                    },
aow: {
  name: "Active overtemperature prewarning",
    convert: BoolToString
},
                    how:{
    name: "Historic overtemperature prewarning",
                        convert: BoolToString
                    },
ao: {
name: "Active overtemperature warning",
    convert: BoolToString
},
ho:{
    name: "Historic overtemperature warning",
    convert: BoolToString
},
                    aoa: {
                        name: "Active overcurrent a",
                        convert: BoolToString
                    },
                    hoa: {
                        name: "Historic overcurrent a",
                        convert: BoolToString
                    },
                    aob: {
                        name: "Active overcurrent b",
                        convert: BoolToString
                    },
                    hob: {
                        name: "Historic overcurrent b",
                        convert: BoolToString
                    },
                    aola: {
                        name: "Active open load a",
                        convert: BoolToString
                    },
                    hola: {
                        name: "Historic open load a",
                        convert: BoolToString
                    },
                    aolb: {
                        name: "Active open load b",
                        convert: BoolToString
                    },
                    holb: {
                        name: "Historic open load b",
                        convert: BoolToString
                    },
                    heo: {
                        name: "Historic home error",
                        convert: BoolToString
                    },
hcm:{
                        name: "Historic CL max",
    convert: BoolToString
},
                    hcf: {
                        name: "Historic CL fit",
                        convert: BoolToString
                    },
                    hrt: {
                        name: "Historic motor flag set",
                        convert: BoolToString
                    },
asg: {
    name: "Active stall guard",
    convert: BoolToString
},
au:{
    name: "Active under voltage",
    convert: BoolToString
},
hu: {
    name: "Historic under voltage",
    convert: BoolToString
},
                    asga:{
                        name: "Active short to ground a",
                        convert: BoolToString
                    },
                    hsga: {
                        name: "Historic short to ground a",
                        convert: BoolToString
                    },
                    asgb:{
                        name: "Active short to ground b",
                        convert: BoolToString
                    },
                    hsgb: {
                        name: "Historic short to ground b",
                        convert: BoolToString
                    },
                    als:{
                        name: "Active L stop",
                        convert: BoolToString
                    },
                    hls: {
                        name: "Historic L stop",
                        convert: BoolToString
                    },
                    ars: {
                        name: "Active R stop",
                        convert: BoolToString
                    },
                    hrs: {
                        name: "Historic R stop",
                        convert: BoolToString
                    },
                    alv: {
                        name: "Active L virtual stop",
                        convert: BoolToString
                    },
                    hlv: {
                        name: "Historic L virtual stop",
                        convert: BoolToString
                    },
                    arv: {
                        name: "Active R virtual stop",
                        convert: BoolToString
                    },
                    hrv: {
                        name: "Historic R virtual stop",
                        convert: BoolToString
                    },
                    frozen: {
                        name: "Frozen",
                        convert: BoolToString
                    },
                    act5e: {
                        name: "Active TMC51x0 error",
                        convert: BoolToString
                    },
                    hist5e:{
                        name: "Historic TMC51x0 error",
                        convert: BoolToString
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
