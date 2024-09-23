import React from "react"
import { DockTileDisabledWithNestedSupport } from "../../dock"

export const RequireEstopGuard = ({ children }) => {
    const estop = false // useEstopInput()

    return (
        <DockTileDisabledWithNestedSupport
            disabled={!estop}
            blur
            content={"You must engage ESTOP to continue"}
        >
            {children}
        </DockTileDisabledWithNestedSupport>
    )
}
