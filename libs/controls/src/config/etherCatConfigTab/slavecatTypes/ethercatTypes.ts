// ** Ethercat data types */
// typedef enum
// {
//     ECT_BOOLEAN         = 0x0001,
//     ECT_INTEGER8        = 0x0002,
//     ECT_INTEGER16       = 0x0003,
//     ECT_INTEGER32       = 0x0004,
//     ECT_UNSIGNED8       = 0x0005,
//     ECT_UNSIGNED16      = 0x0006,
//     ECT_UNSIGNED32      = 0x0007,
//     ECT_REAL32          = 0x0008,
//     ECT_VISIBLE_STRING  = 0x0009,
//     ECT_OCTET_STRING    = 0x000A,
//     ECT_UNICODE_STRING  = 0x000B,
//     ECT_TIME_OF_DAY     = 0x000C,
//     ECT_TIME_DIFFERENCE = 0x000D,
//     ECT_DOMAIN          = 0x000F,
//     ECT_INTEGER24       = 0x0010,
//     ECT_REAL64          = 0x0011,
//     ECT_INTEGER64       = 0x0015,
//     ECT_UNSIGNED24      = 0x0016,
//     ECT_UNSIGNED64      = 0x001B,
//     ECT_BIT1            = 0x0030,
//     ECT_BIT2            = 0x0031,
//     ECT_BIT3            = 0x0032,
//     ECT_BIT4            = 0x0033,
//     ECT_BIT5            = 0x0034,
//     ECT_BIT6            = 0x0035,
//     ECT_BIT7            = 0x0036,
//     ECT_BIT8            = 0x0037
// } ec_datatype;

import { EtherCatBaseType } from "./EtherCatBase"

export const ethercatDataTypes: EtherCatBaseType[] = [
    { index: 0x0001, dataType: "BOOL", bitSize: 8, tsType: "boolean" },
    { index: 0x0002, dataType: "SINT", bitSize: 8, tsType: "number" },
    { index: 0x0003, dataType: "INT", bitSize: 16, tsType: "number" },
    { index: 0x0004, dataType: "DINT", bitSize: 32, tsType: "number" },
    { index: 0x0005, dataType: "USINT", bitSize: 8, tsType: "number" },
    { index: 0x0006, dataType: "UINT", bitSize: 16, tsType: "number" },
    { index: 0x0007, dataType: "UDINT", bitSize: 32, tsType: "number" },
    { index: 0x0008, dataType: "REAL", bitSize: 32, tsType: "number" },
    { index: 0x0009, dataType: "STRINGN", tsType: "string", length: 0 }, // STRING(n)
    { index: 0x000a, dataType: "BYTEN", tsType: "string", length: 0 }, // ARRAY [0..n] OF BYTE
    { index: 0x000b, dataType: "UTF8_STRING(n)", tsType: "string", length: 0 },
    { index: 0x000c, dataType: "TIME_OF_DAY", tsType: "string" },
    { index: 0x000d, dataType: "TIME_DIFFERENCE", tsType: "string" },
    { index: 0x000f, dataType: "DOMAIN", tsType: "string" },
    { index: 0x0010, dataType: "INT24", bitSize: 24, tsType: "number" },
    { index: 0x0011, dataType: "LREAL", bitSize: 64, tsType: "number" },
    { index: 0x0015, dataType: "LINT", bitSize: 64, tsType: "number" },
    { index: 0x0016, dataType: "UINT24", bitSize: 24, tsType: "number" },
    { index: 0x001b, dataType: "ULINT", bitSize: 64, tsType: "number" },
    { index: 0x001e, dataType: "BYTE", bitSize: 8, tsType: "number" }, // extra from SOEM
    { index: 0x0030, dataType: "BIT1", bitSize: 1, tsType: "boolean" },
    { index: 0x0031, dataType: "BIT2", bitSize: 2, tsType: "number" },
    { index: 0x0032, dataType: "BIT3", bitSize: 3, tsType: "number" },
    { index: 0x0033, dataType: "BIT4", bitSize: 4, tsType: "number" },
    { index: 0x0034, dataType: "BIT5", bitSize: 5, tsType: "number" },
    { index: 0x0035, dataType: "BIT6", bitSize: 6, tsType: "number" },
    { index: 0x0036, dataType: "BIT7", bitSize: 7, tsType: "number" },
    { index: 0x0037, dataType: "BIT8", bitSize: 8, tsType: "number" }
]
