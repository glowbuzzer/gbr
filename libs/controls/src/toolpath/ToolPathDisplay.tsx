import * as React from "react"
import { ToolPathScene, ToolPathSceneFactory } from "./ToolPathSceneFactory"
import { useEffect, useRef, useState } from "react"

export const ToolPathDisplay = ({ width, height, path, segments, extent }) => {
    const [scene, setScene] = useState<ToolPathScene>()
    const container = useRef(null)

    useEffect(() => {
        const div = container.current
        if (div) {
            setScene(ToolPathSceneFactory(div, width, height, extent))
        }
    }, [container.current])

    useEffect(() => {
        if (scene && path) {
            scene.setPath(path)
        }
    }, [scene, path])

    useEffect(() => {
        if (scene && segments) {
            scene.setPreview(segments)
        }
    }, [scene, segments])

    return <div ref={container} />
}
