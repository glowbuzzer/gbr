import * as React from "react"
import { useFrames } from "@glowbuzzer/store"
import { FrameSelectorDropdown } from "./FrameSelectorDropdown"

export type FrameSelectorProps = {
    /**
     * Default selected frame
     */
    defaultFrame?: number
    /**
     * Handler for change events
     * @param frameIndex the selected frame
     */
    onChange: (frameIndex: number) => void
}

export const FrameSelector = (props: FrameSelectorProps) => {
    const { asTree: items } = useFrames()

    return <FrameSelectorDropdown items={items} {...props} />
}
