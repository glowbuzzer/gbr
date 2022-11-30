/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { ReactNode } from "react"
import { DockTileDefinition } from "./DockTileDefinition"

export function DockTileDefinitionBuilder(template?: DockTileDefinition) {
    return new (class {
        public definition = { ...template }

        id(id: string) {
            this.definition.id = id
            return this
        }

        name(name: string) {
            this.definition.name = name
            return this
        }

        render(renderFn: () => ReactNode, renderHelpFn?: () => ReactNode) {
            this.definition.render = renderFn
            this.definition.renderHelp = renderHelpFn
            return this
        }

        placement(column: number, row: number) {
            this.definition.defaultPlacement = { column, row }
            return this
        }

        build(): DockTileDefinition {
            return this.definition
        }

        enableWithoutConnection() {
            this.definition.config = { ...this.definition.config, enableWithoutConnection: true }
            return this
        }
    })()
}
