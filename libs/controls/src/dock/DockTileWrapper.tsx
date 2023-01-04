/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useRef } from "react"

export const DockTileWrapper = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // register keyboard event handlers
        const elm = ref.current

        const onKeyDown = (e: KeyboardEvent) => {
            e.stopPropagation()
        }
        const onKeyUp = (e: KeyboardEvent) => {
            e.stopPropagation()
        }

        elm.addEventListener("keydown", onKeyDown)
        elm.addEventListener("keyup", onKeyUp)
        return () => {
            elm.removeEventListener("keydown", onKeyDown)
            elm.removeEventListener("keyup", onKeyUp)
        }
    })

    return (
        <div ref={ref} style={{ width: "100%", height: "100%" }}>
            {children}
        </div>
    )
}
