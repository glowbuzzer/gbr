import * as React from "react"
import { useFrames } from "@glowbuzzer/store"
import { FrameSelectorDropdown, FrameSelectorProps } from "./FrameSelectorDropdown"

export const FrameSelector = (props: FrameSelectorProps) => {
    const { asTree: items } = useFrames()

    return <FrameSelectorDropdown items={items} {...props} />
}
