/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useRef } from "react"

export const DockTileWrapper = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // register keyboard event handlers
        const onKeyDown = (e: KeyboardEvent) => {
            e.stopPropagation()
        }
        const onKeyUp = (e: KeyboardEvent) => {
            e.stopPropagation()
        }

        ref.current.addEventListener("keydown", onKeyDown)
        ref.current.addEventListener("keyup", onKeyUp)
        return () => {
            ref.current.removeEventListener("keydown", onKeyDown)
            ref.current.removeEventListener("keyup", onKeyUp)
        }
    })

    return (
        <div ref={ref} style={{ width: "100%", height: "100%" }}>
            {children}
        </div>
    )
}
