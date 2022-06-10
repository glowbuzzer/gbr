import React from "react"
import { TileProvider } from "./TileProvider"
import { TileLayout } from "./TileLayout"

export type SimpleTileDefinition = {
    title: string
    height: number
    render: React.ReactElement
}

type SimpleTileLayoutProps = {
    appId: string
    tiles: SimpleTileDefinition[][]
    widths: number[]
}

/** @ignore - not currenly supported */
export const SimpleTileLayout = ({ appId, tiles, widths }: SimpleTileLayoutProps) => {
    const mapped = widths
        .flatMap((width, col) => {
            const x = widths.slice(0, col).reduce((sum, v) => sum + v, 0)
            return tiles[col].map((t, row) => ({
                id: `${row}-${col}`,
                x,
                y: 0, // defaults to stacking in tile order
                width,
                ...t
            }))
        })
        .reduce((m, v) => {
            m[v.id] = v
            return m
        }, {})

    return (
        <TileProvider tiles={mapped} prefix={appId}>
            <TileLayout />
        </TileProvider>
    )
}
