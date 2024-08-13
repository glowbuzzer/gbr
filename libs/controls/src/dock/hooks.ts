/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useContext, useState } from "react"
import { DockLayoutContext, DockLayoutContextType } from "./DockLayoutContext"
import { DockTileDefinition } from "./DockTileDefinition"
import { add_tile, is_touch_device } from "./util"
import { Actions, IJsonModel, Model, TabNode } from "flexlayout-react"
import { DockPerspective } from "./types"
import { useLocalStorage } from "../util/LocalStorageHook"
import { DockPerspectiveLayoutProviderProps } from "./DockPerspectiveLayoutProvider"
import { useUser } from "../usermgmt"

const DOCK_MODEL_TEMPLATE: IJsonModel = {
    global: {
        tabSetEnableMaximize: false,
        borderBarSize: 1,
        borderSize: 1,
        tabBorderWidth: 1,
        splitterSize: is_touch_device() ? 20 : 5
    },
    borders: [],
    layout: {
        type: "row",
        id: "root",
        children: []
    }
}

export function useDockLayoutContext() {
    return useContext(DockLayoutContext)
}

type GlowbuzzerDockTileCurrent = Partial<DockTileDefinition> & {
    visible: boolean
}

export function useDockTiles(): GlowbuzzerDockTileCurrent[] {
    const { model, tiles } = useContext(DockLayoutContext)
    return tiles
        .filter(c => c.enableClose !== false)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(tile => ({
            ...tile,
            visible: !!model.getNodeById(tile.id)
        }))
}

function createDockModel(
    availableTiles: DockPerspectiveLayoutProviderProps["tiles"],
    defaultVisible: DockPerspective["defaultVisible"],
    locked: boolean,
    savedLayout: IJsonModel
) {
    const tiles = availableTiles.filter(
        c => c.enableClose === false || !defaultVisible || defaultVisible.includes(c.id)
    )

    const unmodified = JSON.parse(JSON.stringify(DOCK_MODEL_TEMPLATE))
    const modelJson = {
        ...unmodified,
        global: { ...unmodified.global, splitterSize: locked ? 5 : 25 }
    }

    for (const tile of tiles) {
        add_tile(modelJson, tile)
    }

    return {
        currentModel: Model.fromJson({ ...modelJson, ...savedLayout }),
        defaultModel: Model.fromJson(modelJson)
    } as {
        currentModel: Model
        defaultModel: Model
    }
}

export function useDockContext(
    availableTiles: DockTileDefinition[],
    perspectives: DockPerspective[],
    defaultPerspective: string,
    appName: string
): DockLayoutContextType {
    const { currentUser, capabilities } = useUser()
    const [currentPerspective, changePerspective] = useState(defaultPerspective)
    const [locked, setLocked] = useState(true)
    const [savedLayout, updateSavedLayout] = useLocalStorage(
        `docklayout-${currentUser?._id || "anonymous"}`,
        null,
        `${appName}-${currentPerspective}`
    )
    const perspective = perspectives.find(p => p.id === currentPerspective)
    if (!perspective) {
        throw new Error(`Perspective ${currentPerspective} not found`)
    }

    const { defaultVisible } = perspective

    const { currentModel, defaultModel } = createDockModel(
        availableTiles.filter(tile => !tile.capability || capabilities.includes(tile.capability)),
        defaultVisible,
        locked,
        savedLayout
    )

    const model = currentModel

    function updateModel(model: Model) {
        // updateModelInternal(model)
        updateSavedLayout({ layout: model.toJson().layout })
    }

    function resetLayout() {
        updateModel(defaultModel)
    }

    function tileFor(id: string): DockTileDefinition {
        const definition: DockTileDefinition = availableTiles.find(c => c.id === id)

        if (!definition) {
            console.warn("No tile definition found for id", id, availableTiles)
            return {
                id: undefined,
                render() {
                    return "No tile definition found for id " + id
                }
            }
        }

        if (!definition.tile) {
            console.log("Tile did not use DockTileDefinitionBuilder to create definition", id)
            return {
                id,
                render() {
                    return "Tile does not use DockTileDefinitionBuilder " + id
                }
            }
        }

        return definition
        // use this for testing to render simple content in every tile
        // return {
        //     ...definition,
        //     render() {
        //         return createElement(TestDummyTile)
        //     }
        // }
    }

    return {
        appName: `${appName}-${currentPerspective}`,
        tiles: availableTiles,
        perspectives,
        model: model,
        locked,
        currentPerspective,
        changePerspective,
        resetLayout,
        setLocked,
        factory: (node: TabNode) => {
            return tileFor(node.getId()).render()
        },
        settingsFactory: (node: TabNode) => {
            return tileFor(node.getId()).renderSettings?.()
        },
        headerFactory: (node: TabNode) => {
            return tileFor(node.getId()).renderHeader?.()
        },
        buttonsFactory: (node: TabNode) => {
            return tileFor(node.getId()).renderButtons?.()
        },
        helpFactory: (node: TabNode) => {
            return tileFor(node.getId()).renderHelp?.()
        },
        updateModel: new_model => {
            // model object is not changed, so we need to force a re-render
            updateModel(Model.fromJson(new_model.toJson()))
        },
        showTile(id: string, show: boolean = false) {
            if (!show) {
                model.doAction(Actions.deleteTab(id))
            } else {
                const existing = model.getNodeById(id)
                if (existing) {
                    model.doAction(Actions.selectTab(id))
                } else {
                    // tab was closed so we need to add it back in
                    const modelJson = model.toJson()
                    add_tile(modelJson, tileFor(id))
                    const new_model = Model.fromJson(modelJson)
                    new_model.doAction(Actions.selectTab(id))
                    updateModel(new_model)
                }
            }
        }
    }
}
