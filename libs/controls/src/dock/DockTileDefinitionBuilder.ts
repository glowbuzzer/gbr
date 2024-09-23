/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement, FunctionComponent, ReactNode } from "react"
import { DockTileDefinition } from "./DockTileDefinition"
import { DockTileStandardWrapper } from "./DockTileStandardWrapper"

type Factory = (child: any) => () => ReactNode

export function DockTileDefinitionBuilder(template?: DockTileDefinition) {
    return new (class {
        public wrappers: Factory[] = []

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
            this.definition.render = renderFn
            this.definition.renderHelp = renderHelpFn
            this.definition.renderButtons = renderButtonsFn
            return this
        }

        wrap<T>(element: FunctionComponent<Omit<T, "children">>, props: T = null) {
            this.wrappers.push(
                child => () => createElement(element, { ...props, children: child() })
            )
            return this
        }

        placement(column: number, row: number) {
            this.definition.defaultPlacement = { column, row }
            return this
        }

        build(): DockTileDefinition {
            this.definition.render = this.wrappers.reduce(
                (acc, wrapper) => wrapper(acc),
                this.definition.render
            )
            return this.definition
        }

        /** @deprecated */
        enableWithoutConnection() {
            console.warn("enableWithoutConnection is deprecated, use requiresConnection instead")
            return this
        }

        requiresConnection() {
            return this.wrap(DockTileStandardWrapper, { requireOpEnabled: false })
        }

        requiresOperationEnabled() {
            return this.wrap(DockTileStandardWrapper, { requireOpEnabled: true })
        }

        requiresCapability(capability: symbol) {
            this.definition.capability = capability
            return this
        }
    })()
}
