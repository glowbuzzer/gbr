/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ReactComponent as UndoIcon } from "@material-symbols/svg-400/outlined/undo.svg"
import { ReactComponent as RedoIcon } from "@material-symbols/svg-400/outlined/redo.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { useFlowUndo } from "@glowbuzzer/store"

export const FlowUndoRedoButtons = () => {
    const { undo, redo } = useFlowUndo()

    return (
        <>
            <GlowbuzzerIcon Icon={UndoIcon} button disabled={!undo} onClick={undo} />
            <GlowbuzzerIcon Icon={RedoIcon} button disabled={!redo} onClick={redo} />
        </>
    )
}
