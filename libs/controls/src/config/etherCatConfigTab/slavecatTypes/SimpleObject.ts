import { DefaultValue } from "./DefaultValue"
import { EtherCatBaseType } from "./EtherCatBase"

export type SimpleObject = {
    index?: number
    subIndex?: number
    name: string
    defaultValue?: DefaultValue
    min?: number
    max?: number
    unit?: string
    flags?: string
    dataType?: EtherCatBaseType
    bitSize?: number
    description?: string
    children?: SimpleObject[]
}
