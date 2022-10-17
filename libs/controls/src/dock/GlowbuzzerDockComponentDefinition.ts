/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { IJsonTabNode } from "flexlayout-react"
import { ReactNode } from "react"

type GlowbuzzerDockPlacement = {
    column: number
    row: number
}

export interface GlowbuzzerDockComponentDefinition extends IJsonTabNode {
    id: string

    factory(): ReactNode

    settingsFactory?(): ReactNode

    headerFactory?(): ReactNode

    buttonsFactory?(): ReactNode

    helpFactory?(): ReactNode

    defaultPlacement?: GlowbuzzerDockPlacement
}
