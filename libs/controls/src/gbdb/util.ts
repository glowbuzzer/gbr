/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { GbdbFacetIndicator } from "./GbdbFacetIndicator"

export function gbdbFacetIndicatorFactory(sliceName: string, propertyName?: string) {
    return () => createElement(GbdbFacetIndicator, { sliceName, propertyName }, null)
}
