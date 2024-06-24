/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createElement, isValidElement, ReactNode } from "react"
import { DockTileDefinition } from "./DockTileDefinition"
import { DockTileDisabled } from "./DockTileDisabled"

function convertToReactElement(tile: ReactNode) {
    if (isValidElement(tile)) {
        return tile
    }
    return createElement(React.Fragment, { children: tile })
}

export type TileWrapperFactory = (
    tile: React.ReactNode,
    connected: boolean,
    op: boolean,
    mode: string
) => React.ReactElement

export function DockTileDefinitionBuilder(template?: DockTileDefinition) {
    return new (class {
        public definition: DockTileDefinition = {
            renderWrapper(tile: ReactNode, connected: boolean, _op: boolean, _mode: string) {
                return connected
                    ? convertToReactElement(tile)
                    : createElement(DockTileDisabled, {
                          children: tile
                      })
            },
            ...template
        }

        id(id: string) {
            this.definition.id = id
            return this
        }

        name(name: string) {
            this.definition.name = name
            return this
        }

        render(
            renderFn: () => ReactNode,
            renderHelpFn?: () => ReactNode,
            renderButtonsFn?: () => ReactNode
        ) {
            this.definition.render = renderFn
            this.definition.renderHelp = renderHelpFn
            this.definition.renderButtons = renderButtonsFn
            return this
        }

        placement(column: number, row: number) {
            this.definition.defaultPlacement = { column, row }
            return this
        }

        build(): DockTileDefinition {
            return this.definition
        }

        wrapper(wrapperFactory: TileWrapperFactory) {
            this.definition.renderWrapper = wrapperFactory
            return this
        }

        enableWithoutConnection() {
            this.definition.renderWrapper = convertToReactElement
            return this
        }

        requiresOperationEnabled() {
            this.definition.renderWrapper = (tile, connected, op) => {
                if (!connected || !op) {
                    return createElement(DockTileDisabled, {
                        children: tile,
                        disabledOnly: connected
                    })
                }
                return convertToReactElement(tile)
            }
            return this
        }
    })()
}
