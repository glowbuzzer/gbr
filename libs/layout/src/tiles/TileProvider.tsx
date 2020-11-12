import * as React from "react"
import {FC, useContext} from "react"
import {useLocalStorage} from "./LocalStorageHook"
import {tileLayoutContext, TileLayoutContextType} from "./TileContext";

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
    tiles: TileConfiguration
}

export const TileProvider: FC<TileProviderProps> = ({ tiles, children }) => {
    const tilesAsArray = Object.entries(tiles).map(([id, tile]) => ({ id, ...tile }))
    const defaultVisibility = fromEntries(tilesAsArray.map(t => [t.id, true]))
    const [visibility, setVisibility] = useLocalStorage("tiles.visible", defaultVisibility)

    const context: TileLayoutContextType = {
        tiles: tilesAsArray.map(t => ({ ...t, visible: visibility[t.id] })),
        setVisible(id: string, value: boolean) {
            console.log("SET VISIBLE", id, value)
            setVisibility(visibility => ({
                ...visibility,
                [id]: value
            }))
        },
        onLayoutChange(layout) {
            console.log("LAYOUT CHANGE", layout)
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
