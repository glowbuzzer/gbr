/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

export function add_component(modelJson, component) {
    const { column, row } = component.defaultPlacement ?? { column: 2, row: 0 }

    const WEIGHTS = [10, 50, 25]
    const layout = modelJson.layout

    // console.log("ADD COMPONENT", column, weight, component.id, layout.children.length)
    while (layout.children.length <= column) {
        const weight = WEIGHTS[layout.children.length]
        layout.children.push({
            type: "row",
            weight,
            children: [
                {
                    type: "tabset",
                    children: []
                }
            ]
        })
    }

    const col = layout.children[column]

    if (col.type === "tabset") {
        // only one tabset in the column
        col.children.push({
            type: "tab",
            ...component
        })
    } else {
        while (col.children.length <= row) {
            col.children.push({
                type: "tabset",
                children: []
            })
        }
        col.children[row].children.push({
            type: "tab",
            ...component
        })
    }
}
