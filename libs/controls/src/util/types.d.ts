/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

declare module "*.svg" {
    import React from "react"
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}
