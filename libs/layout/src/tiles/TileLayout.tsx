import React from "react"
import RGL, { Layout, WidthProvider } from "react-grid-layout"
import styled from "styled-components"
import { useTiles } from "./TileProvider"

const ReactGridLayout = WidthProvider(RGL)

const TileContainer = styled.div`
    height: 100%;
    background: white;
`

export const TileLayout = () => {
    const { tiles, onLayoutChange } = useTiles()

    const layout: Layout[] = Object.entries(tiles).map(([, { id, x, y, width, height }]) => ({
        i: id,
        x,
        y,
        w: width,
        h: height,
        minH: 2,
        minW: x === 1 ? 4 : 1
    }))

    const containers = Object.entries(tiles)
        .filter(([, tile]) => tile.visible)
        .map(([, { render, ...tile }]) => (
            <TileContainer key={tile.id}>
                {typeof render === "function" ? render(tile) : render}
            </TileContainer>
        ))

    return (
        <ReactGridLayout
            cols={8}
            rowHeight={50}
            layout={layout}
            draggableHandle=".draggable"
            onLayoutChange={onLayoutChange}
        >
            {containers}
        </ReactGridLayout>
    )
}
