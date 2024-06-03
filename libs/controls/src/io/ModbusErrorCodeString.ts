import { MODBUSERRORCODES } from "@glowbuzzer/store"

export const ModbusErrorCodeString = errorCode => {
    switch (errorCode) {
        case MODBUSERRORCODES.MODBUS_NO_SLAVE_INIT:
            return "Modbus slave didn't initialise correctly"
        case MODBUSERRORCODES.MODBUS_NO_ERROR:
            return "Modbus no error"
        case MODBUSERRORCODES.MODBUS_COMMS_TIMEOUT:
            return "Modbus timeout error"
        case MODBUSERRORCODES.MODBUS_BAD_CRC:
            return "Modbus CRC error"
        case MODBUSERRORCODES.MODBUS_BAD_DATA:
            return "Modbus bad data"
        case MODBUSERRORCODES.MODBUS_BAD_FUNCTION:
            return "Modbus bad function"
        case MODBUSERRORCODES.MODBUS_BAD_EXCEPTION:
            return "Modbus bad exception code"
        case MODBUSERRORCODES.MODBUS_TOO_MUCH_DATA:
            return "Modbus too much data"
        case MODBUSERRORCODES.MODBUS_BAD_SLAVE:
            return "Modbus bad slave"
        case MODBUSERRORCODES.MODBUS_INTERNAL_TIMEOUT:
            return "Modbus internal timeout"
        case MODBUSERRORCODES.MODBUS_CONNECTION_RESET:
            return "Modbus connection reset"
        case MODBUSERRORCODES.MODBUS_INVALID_ARGUMENT:
            return "Modbus invalid argument"
        case MODBUSERRORCODES.MODBUS_INTERRUPTED:
            return "Modbus interrupted"
        case MODBUSERRORCODES.MODBUS_EX_ILLEGAL_FUNCTION:
            return "Modbus exception illegal function"
        case MODBUSERRORCODES.MODBUS_EX_ILLEGAL_DATA_ADDRESS:
            return "Modbus exception illegal data address"
        case MODBUSERRORCODES.MODBUS_EX_ILLEGAL_DATA_VALUE:
            return "Modbus exception illegal data value"
        case MODBUSERRORCODES.MODBUS_EX_SLAVE_OR_SERVER_FAILURE:
            return "Modbus exception slave or server failure"
        case MODBUSERRORCODES.MODBUS_EX_ACKNOWLEDGE:
            return "Modbus exception acknowledge"
        case MODBUSERRORCODES.MODBUS_EX_SLAVE_OR_SERVER_BUSY:
            return "Modbus exception slave or server busy"
        case MODBUSERRORCODES.MODBUS_EX_NEGATIVE_ACKNOWLEDGE:
            return "Modbus exception negative acknowledge"
        case MODBUSERRORCODES.MODBUS_EX_MEMORY_PARITY:
            return "Modbus exception memory parity"
        case MODBUSERRORCODES.MODBUS_EX_GATEWAY_PATH:
            return "Modbus exception gateway path"
        case MODBUSERRORCODES.MODBUS_EX_GATEWAY_TARGET:
            return "Modbus exception gateway target"
        case MODBUSERRORCODES.MODBUS_EL6021_RX_FIFO_FULL:
            return "Modbus EL6021 RX FIFO full"
        case MODBUSERRORCODES.MODBUS_EL6021_PARITY_ERROR:
            return "Modbus EL6021 parity error"
        case MODBUSERRORCODES.MODBUS_EL6021_FRAMING_ERROR:
            return "Modbus EL6021 framing error"
        case MODBUSERRORCODES.MODBUS_EL6021_OVERRUN_ERROR:
            return "Modbus EL6021 overrun error"
        case MODBUSERRORCODES.MODBUS_EL6021_NO_SLAVE_INIT:
            return "Modbus EL6021 slave didn't initialise"
        case MODBUSERRORCODES.MODBUS_GENERAL_ERROR:
            return "Modbus general error"
        default:
            return "Unknown error"
    }
}
