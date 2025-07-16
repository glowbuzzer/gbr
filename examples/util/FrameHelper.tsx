import { useFrames } from "@glowbuzzer/store"
import { ReactNode } from "react"
import { useConfigLiveEdit } from "@glowbuzzer/controls"

type FrameHelperProps = {
    frameName: string
    children: ReactNode
}

/**
 * FrameHelper is a helper component that positions its children relative to a frame, identified by frame name.
 *
 * If the frame name is not found, the children are rendered as is.
 *
 * @param frameName
 * @param children
 */
export const FrameHelper = ({ frameName, children }: FrameHelperProps) => {
    const editedFrames = useConfigLiveEdit().frames
    const { asList: frames } = useFrames(editedFrames)
    const frame = frames.find(f => f.name === frameName)

    if (!frame) {
        // frame not found
        return children
    }

    const { translation, rotation } = frame.absolute

    return (
        <group position={translation} quaternion={rotation}>
            {children}
        </group>
    )
}
