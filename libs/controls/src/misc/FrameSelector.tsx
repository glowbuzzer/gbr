import * as React from "react"
import { useFrames } from "@glowbuzzer/store"
import { FrameSelectorDropdown } from "./FrameSelectorDropdown"

export type FrameSelectorProps = {
    /**
     * Selected frame
     */
    value: number
    /**
     * Default frame (will be highlighted). Normally this is the kinematics configuration's frame index
     */
    defaultFrame?: number
    /**
     * Whether to hide "World" at the top of the list
     */
    hideWorld?: boolean
    /**
     * Handler for change events
     * @param frameIndex the new selected frame
     */
    onChange: (frameIndex: number) => void
}

/**
 * Provides a way to select preferred frame of reference (normally used in combination with a digital readout component).
 */
export const FrameSelector = (props: FrameSelectorProps) => {
    const { asTree: items } = useFrames()

    return <FrameSelectorDropdown items={items} {...props} />
}
