/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
// noinspection JSUnusedGlobalSymbols

import { DictionaryNode } from "./dictionaryUtils"

import {
    FSOE_MASTER_HIGH_LEVEL_STATE,
    FSOE_SLAVE_HIGH_LEVEL_STATE,
    FSOE_SLAVE_TYPE
} from "@glowbuzzer/store"
import { extractValidKeys } from "./EmStatsUtils"

export enum CIA_STATE {
    "CIA NOT READY TO SWITCH ON",
    "CIA SWITCH ON DISABLED",
    "CIA READY TO SWITCH ON",
    "CIA SWITCHED ON",
    "CIA OPERATION ENABLED",
    "CIA_QUICK STOP ACTIVE",
    "CIA FAULT REACTION ACTIVE",
    "CIA FAULT"
}

export enum MOO {
    "CIA MOO OP DISABLED", //0
    "CIA MOO PROFILE POS", //1
    "CIA MOO PROFILE VEL", //2
    "INVALID MOO (3)", // Placeholder for 3 (not defined)
    "INVALID MOO (4)", // Placeholder for 4 (not defined)
    "INVALID MOO (5)", // Placeholder for 5 (not defined)
    "CIA MOO HOMING", //6
    "INVALID MOO (7)", // Placeholder for 7 (not defined)
    "CIA MOO CSP", //8
    "CIA MOO CSV", //9
    "CIA MOO CST" //10
}

export enum CIA_COMMAND {
    "CIA SHUTDOWN",
    "CIA SWITCH ON",
    "CIA DISABLE VOLTAGE",
    "CIA QUICK STOP",
    "CIA DISABLE OPERATION",
    "CIA ENABLE OPERATION",
    "CIA FAULT RESET"
}

export const EC_STATE = {
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
export const EC_ALSTATUSCODE = {
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

function NumberToStringBlocksOfEight(value: number) {
    const binaryString = value ? value.toString(2) : "0"

    // Split the binary string into blocks of 8 bits
    const binaryBlocks = binaryString.match(/.{1,8}/g)

    // Join the blocks with a space for better readability
    const result = binaryBlocks ? binaryBlocks.join(" ") : "00000000"

    return result
}

function AlStatusCodeToString(value: number) {
    return EC_ALSTATUSCODE[value] || "Unknown"
}

function FsoeHighLevelStateToString(value: number) {
    return (FSOE_SLAVE_HIGH_LEVEL_STATE[value] || "UNKNOWN").substring(28)
}

function testBit(number: number, bitPosition: number): boolean {
    const bitmask = 1 << bitPosition
    // console.log(number, bitPosition)
    return (number & bitmask) !== 0
}

const SynapticonSlaveStateBitTextObject = {
    0: "STO",
    1: "reserved",
    2: "Reserved",
    3: "SOS",
    4: "Reserved",
    5: "Reserved",
    6: "Reserved",
    7: "Error",
    8: "SS1",
    9: "SS2",
    10: "Unused",
    11: "Unused",
    12: "SLS1",
    13: "SLS2",
    14: "SLS3",
    15: "SLS4",
    16: "Restart ack needed",
    17: "Brake engaged",
    18: "Temp warn",
    19: "Safe pos valid",
    20: "Safe vel valid",
    21: "Unused",
    22: "Unused",
    23: "Unused",
    24: "Safe in 1",
    25: "Safe in 2",
    26: "Reserved",
    27: "Reserved",
    28: "Safe out 1",
    29: "Reserved",
    30: "Analog in diagnostic active",
    31: "Analog in valid"
}

function FsoeSynapticonSlaveStateToString(value: number) {
    let concatenatedText = " "
    let isFirstBit = true

    for (const bit in SynapticonSlaveStateBitTextObject) {
        if (SynapticonSlaveStateBitTextObject.hasOwnProperty(bit)) {
            const bitNumber = parseInt(bit, 10)

            if (testBit(value, bitNumber)) {
                if (!isFirstBit) {
                    // If it's not the first bit, add " + " separator
                    concatenatedText += " + "
                }

                concatenatedText += SynapticonSlaveStateBitTextObject[bitNumber]
                isFirstBit = false // Update the flag
            }
        }
    }
    if (isFirstBit) {
        return concatenatedText.trim() // Trim to remove trailing space
    } else {
        return concatenatedText
    }
}

function FsoeSlaveTypeToString(value: number) {
    return (FSOE_SLAVE_TYPE[value] || "UNKNOWN").substring(16)
}

enum FsoeSlaveType {
    UNKNOWN_SLAVE_TYPE = "Unknown slave type",
    FSOE_SLAVE_TYPE_SYNAPTICON = "FSOE_SLAVE_TYPE_SYNAPTICON",
    FSOE_SLAVE_TYPE_SCU_1_EC = "FSOE_SLAVE_TYPE_SCU_1_EC"
}

function FsoeMapSlaveType(value: string): FsoeSlaveType {
    switch (value) {
        case FsoeSlaveType.FSOE_SLAVE_TYPE_SYNAPTICON:
            return FsoeSlaveType.FSOE_SLAVE_TYPE_SYNAPTICON
        case FsoeSlaveType.FSOE_SLAVE_TYPE_SCU_1_EC:
            return FsoeSlaveType.FSOE_SLAVE_TYPE_SCU_1_EC
        default:
            return FsoeSlaveType.UNKNOWN_SLAVE_TYPE
    }
}

function FsoeMasterHighLevelStateTypeToString(value: number) {
    // return FSOE_MASTER_HIGH_LEVEL_STATE[value] || "Unknown"
    return (FSOE_MASTER_HIGH_LEVEL_STATE[value] || "UNKNOWN").substring(29)
}

function EcStateToString(value: number) {
    return EC_STATE[value] || "UNKNOWN"
}

function CiaCommandToString(value: number) {
    return CIA_COMMAND[value] || "Unknown"
}

function CiaStateToString(value: CIA_STATE) {
    return CIA_STATE[value]
}

function MooToString(value: MOO) {
    return MOO[value]
}

function BoolToString(value: boolean) {
    return value ? "True" : "False"
}

// function BoolToString(value: boolean, obj: any) {
//     return value ? "True" : "False";
// }

function SafetyStateToString(value: boolean) {
    return value ? "Safety Fault" : "No Safety fault"
}

function NumberToBinaryString(value: number) {
    return value ? NumberToStringBlocksOfEight(value) : "0"
}

function ToHex(value: number) {
    return "0x" + value.toString(16)
}

function ToDateString(value: string) {
    const timestampRegex = /Time:(\d+\.\d+)/
    const match = value.match(timestampRegex)

    if (match) {
        const timestamp = parseFloat(match[1])
        const newDate = new Date()
        newDate.setTime(timestamp * 1000)
        return newDate.toUTCString()
    }
    return value
}

const emStatDrivesDictionary: DictionaryNode = {
    type: "object",
    children: {
        mst: {
            name: "Machine CIA State",
            convert: CiaStateToString
        },
        mcst: {
            name: "Machine CIA Command",
            convert: CiaCommandToString
        },
        mss: {
            name: "Safety state",
            convert: SafetyStateToString
        },
        dct: {
            name: "Drive count"
        },
        Drives: {
            type: "array",
            nameProperty: "Drive name",
            children: {
                dsn: {
                    name: "Drive secondary name"
                },
                das: {
                    name: "Drive CIA State",
                    convert: CiaStateToString
                },
                dcmo: {
                    name: "Drive commanded Mode of Operation",
                    convert: MooToString
                },
                damo: {
                    name: "Drive actual Mode of Operation",
                    convert: MooToString
                },
                dcs: {
                    name: "Drive CIA Command",
                    convert: CiaCommandToString
                },

                dail: {
                    name: "Active internal limit",
                    convert: BoolToString
                },
                dhil: {
                    name: "Historic internal limit",
                    convert: BoolToString
                },
                dafe: {
                    name: "Active follow error",
                    convert: BoolToString
                },
                dhfe: {
                    name: "Historic follow error",
                    convert: BoolToString
                },
                daw: {
                    name: "Active warning",
                    convert: BoolToString
                },
                dhw: {
                    name: "Historic warning",
                    convert: BoolToString
                },

                daf: {
                    name: "Active fault",
                    convert: BoolToString
                },
                dhf: {
                    name: "Historic fault",
                    convert: BoolToString
                },

                dem: {
                    name: "Drive error message"
                },
                dhem: {
                    name: "Drive historic error message"
                }
            }
        }

        // ...
    }
}

export function toTableDataEmStatDrives(
    obj,
    parentKey = "",
    dict: DictionaryNode | undefined = emStatDrivesDictionary
) {
    const result = []

    const validKeys = extractValidKeys(emStatDrivesDictionary)

    for (const key in obj) {
        if (!validKeys.includes(key) && isNaN(Number(key))) {
            continue
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
            const child_dict = dict?.type === "array" ? dict : dict?.children?.[key]
            const children = toTableDataEmStatDrives(obj[key], key, child_dict)
            result.push({
                key: parentKey + "/" + key,
                property: obj[key][dict?.nameProperty] || key,
                value: "",
                children
            })
        } else {
            const leaf_dict = dict?.children?.[key]
            result.push({
                key: parentKey + "/" + key,
                property: leaf_dict?.name || key,
                // value: leaf_dict?.convert?.(obj[key]) || obj[key]
                value: leaf_dict?.convert?.(obj[key], obj) || obj[key]
            })
        }
    }

    return result
}
