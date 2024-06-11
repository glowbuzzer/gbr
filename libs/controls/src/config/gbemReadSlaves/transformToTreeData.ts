// import { DataNode } from "antd/lib/tree"
import { SimpleObject } from "../slavecatTypes/SimpleObject"
import { DefaultValue } from "../slavecatTypes/DefaultValue"

export interface DataNode {
    title: string
    name: string
    index: number
    key: string
    children: DataNode[]
    flags?: any // Define proper type if known
    unit?: string
    dataType?: string
    dataTypeCode?: number
    defaultValue?: any
    min?: number
    max?: number
    subIndex?: number
    bitSize?: number
    description?: string
}

const getStringValueFromDefaultValue = (defaultValue: DefaultValue): string => {
    if (!defaultValue || defaultValue.type === undefined) {
        return "undefined" // or any default string you prefer
    }

    switch (defaultValue.type) {
        case "string":
            return defaultValue.value
        case "number":
            return defaultValue.value.toString()
        case "boolean":
            return defaultValue.value ? "true" : "false"
        default:
            return "unexpected type"
    }
}

export const transformToTreeData = (data: SimpleObject[], parentPath?: string): DataNode[] => {
    return data.map(item => {
        const isParent = !!item.children && item.children.length > 0

        const currentPath = parentPath
            ? `${parentPath}-${item.index?.toString(16).toUpperCase()}${
                  item.subIndex !== undefined ? `-${item.subIndex.toString(16).toUpperCase()}` : ""
              }`
            : `${item.index?.toString(16).toUpperCase()}${
                  item.subIndex !== undefined ? `-${item.subIndex.toString(16).toUpperCase()}` : ""
              }`

        const title =
            parentPath === undefined
                ? `${
                      item.index !== undefined
                          ? `16#${item.index.toString(16).toUpperCase()}:0`
                          : ""
                  } ${item.name}`
                : `${parentPath !== undefined ? `16#${parentPath}` : ""}${
                      item.subIndex !== undefined
                          ? `:${item.subIndex.toString(16).toUpperCase()}`
                          : ""
                  } ${item.name}`

        return {
            title: title,
            name: item.name,
            key: currentPath,
            children: item.children
                ? transformToTreeData(
                      item.children,
                      `${item.index?.toString(16).toUpperCase()}${
                          item.subIndex !== undefined
                              ? `-${item.subIndex.toString(16).toUpperCase()}`
                              : ""
                      }`
                  )
                : [],
            // disabled: isParent, // Disable selection if node has children
            flags: item.flags,
            unit: item.unit,
            dataType: item?.dataType?.dataType,
            dataTypeCode: item?.dataType?.index,
            min: item.min,
            max: item.max,
            subIndex: item.subIndex,
            index: item.index,
            bitSize: item.bitSize,
            description: item.description,
            defaultValue: getStringValueFromDefaultValue(item?.defaultValue)

            // ...item // Spread item properties to ensure they are part of the node
        }
    })
}
