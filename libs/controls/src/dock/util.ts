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

    const existing = layout.children[column]

    if (existing.type === "tabset") {
        // only one tabset in the column, so we want to replace it with a row
        layout.children[column] = {
            type: "row",
            weight: existing.weight,
            children: [existing]
        }
    }

    const col = layout.children[column]

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
