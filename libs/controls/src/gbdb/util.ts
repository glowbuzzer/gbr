/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { GbDbFacetIndicator } from "./GbDbFacetIndicator"

export function gbdbFacetIndicatorFactory(sliceName: string, propertyName?: string) {
    return () => createElement(GbDbFacetIndicator, { sliceName, propertyName }, null)
}
