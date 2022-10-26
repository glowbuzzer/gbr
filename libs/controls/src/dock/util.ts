/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

export function add_tile(modelJson, tile) {
    const { column, row } = tile.defaultPlacement ?? { column: 2, row: 0 }

    const WEIGHTS = [10, 50, 25]
    const layout = modelJson.layout

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
            ...tile
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
            ...tile
        })
    }
}
