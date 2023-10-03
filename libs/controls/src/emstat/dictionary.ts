/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// noinspection JSUnusedGlobalSymbols
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

function CiaStateToString(value: CIA_STATE) {
    return CIA_STATE[value]
}

type DictionaryNode = {
    children?: Record<string, DictionaryNode>
    type?: "array" | "object"
    name?: string
    nameProperty?: string
    convert?(value: any): string
}

const dictionary: DictionaryNode = {
    type: "object",
    children: {
        "Machine CIA state": {
            name: "Machine CIA State",
            convert: CiaStateToString
        },
        Drives: {
            type: "array",
            nameProperty: "Drive name",
            children: {
                "Drive CIA state": {
                    name: "Drive CIA State",
                    convert: CiaStateToString
                }
            }
        }
        // ...
    }
}

export function to_table_data_new(
    obj,
    parentKey = "",
    dict: DictionaryNode | undefined = dictionary
) {
    const result = []

    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            const child_dict = dict?.type === "array" ? dict : dict?.children?.[key]
            const children = to_table_data_new(obj[key], key, child_dict)
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
                value: leaf_dict?.convert?.(obj[key]) || obj[key]
            })
        }
    }

    return result
}
