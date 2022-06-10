import * as React from "react"
import { FC, ReactNode, useContext } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import { tileLayoutContext, TileLayoutContextType } from "./TileContext"

function fromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}

export type TileDefinition = {
    render: React.ReactNode | ((tile: Omit<TileDefinition, "render">) => React.ReactNode)
    title: string
    x: number
    y: number
    width: number
    height: number
}

export type TileConfiguration = { [index: string]: TileDefinition }

type TileProviderProps = {
    prefix?: string
    tiles: TileConfiguration
    children: ReactNode
}

/** @ignore - not currently supported */
export const TileProvider: FC<TileProviderProps> = ({ prefix, tiles, children }) => {
    const defaultTilesAsArray = Object.entries(tiles).map(([id, tile]) => ({ id, ...tile }))
    const defaultVisibility = fromEntries(defaultTilesAsArray.map(t => [t.id, true]))
    const [visibility, setVisibility] = useLocalStorage("tiles.visible", defaultVisibility)
    const [layout, setLayout] = useLocalStorage(
        "tiles.layout" + (prefix ? "." + prefix : ""),
        defaultTilesAsArray
    )

    const final_layout = defaultTilesAsArray.map(t => ({
        ...t,
        ...layout.find(l => l.id === t.id)
    }))

    const context: TileLayoutContextType = {
        tiles: final_layout.map(t => ({ ...t, visible: visibility[t.id] })),
        setVisible(id: string, value: boolean) {
            setVisibility(visibility => ({
                ...visibility,
                [id]: value
            }))
        },
        onLayoutChange(layout) {
            // convert from lib type to our type
            setLayout(
                layout.map(l => ({
                    id: l.i,
                    x: l.x,
                    y: l.y,
                    width: l.w,
                    height: l.h
                }))
            )
        }
    }
    return <tileLayoutContext.Provider value={context}>{children}</tileLayoutContext.Provider>
}

export const useTiles = () => {
    const context = useContext(tileLayoutContext)
    if (!context) {
        throw new Error("No tile context. Missing TileProvider in hierarchy?")
    }

    return context
}
