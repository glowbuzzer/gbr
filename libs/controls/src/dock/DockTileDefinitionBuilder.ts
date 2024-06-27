/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement, FunctionComponent, ReactNode } from "react"
import { DockTileDefinition } from "./DockTileDefinition"
import { DockTileStandardWrapper } from "./DockTileStandardWrapper"
import Element = React.JSX.Element

export function DockTileDefinitionBuilder(template?: DockTileDefinition) {
    return new (class {
        public definition: DockTileDefinition = {
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
            this.definition.tile = template?.tile || renderFn
            this.definition.render = renderFn
            this.definition.renderHelp = renderHelpFn
            this.definition.renderButtons = renderButtonsFn
            return this
        }

        wrap(element: FunctionComponent<{ children: ReactNode }>) {
            this.definition.render = () =>
                createElement(element, { children: this.definition.tile() })

            return this
        }

        placement(column: number, row: number) {
            this.definition.defaultPlacement = { column, row }
            return this
        }

        build(): DockTileDefinition {
            return this.definition
        }

        /** @deprecated */
        enableWithoutConnection() {
            console.warn("enableWithoutConnection is deprecated, use requiresConnection instead")
            return this
        }

        requiresConnection() {
            if (!this.definition.tile) {
                throw new Error("render function must be set before calling requiresConnection")
            }
            this.definition.render = () =>
                createElement(DockTileStandardWrapper, {
                    children: this.definition.tile(),
                    requireOpEnabled: false
                })

            return this
        }

        requiresOperationEnabled() {
            if (!this.definition.tile) {
                throw new Error(
                    "render function must be set before calling requiresOperationEnabled"
                )
            }
            this.definition.render = () =>
                createElement(DockTileStandardWrapper, {
                    children: this.definition.tile(),
                    requireOpEnabled: true
                })

            return this
        }
    })()
}
