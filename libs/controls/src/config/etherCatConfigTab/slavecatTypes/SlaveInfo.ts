import { SimpleObject } from "./SimpleObject"

export interface slaveInfo {
    vendorId: number
    vendor: string
    image: string
    deviceName: string
    deviceProductCode: string
    deviceRevisionNumber: string
    simpleSlaveObjects: SimpleObject[]
}
