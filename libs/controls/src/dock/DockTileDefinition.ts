/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { IJsonTabNode } from "flexlayout-react"
import { ReactNode } from "react"

type DockTilePlacement = {
    column: number
    row: number
}

export interface DockTileDefinition extends IJsonTabNode {
    id: string

    render(props?): ReactNode

    renderSettings?(): ({ open, onClose }) => JSX.Element

    renderHeader?(): ReactNode

    renderButtons?(): ReactNode

    renderHelp?(): ReactNode

    defaultPlacement?: DockTilePlacement

    excludeByDefault?: boolean
}
