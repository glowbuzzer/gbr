import {createContext} from "react";
import {TileDefinition} from "./TileProvider";

type TileInstance = TileDefinition & { id: string; visible: boolean }

export type TileLayoutContextType = {
    tiles: TileInstance[]
    setVisible(id: string, visible: boolean): void
    onLayoutChange(layout): void
}

export const tileLayoutContext = createContext<TileLayoutContextType | undefined>(undefined)

export type TileContextType = {
    showSettings: boolean
    setShowSettings(value: boolean): void
}

export const tileContext = createContext<TileContextType>(null)

