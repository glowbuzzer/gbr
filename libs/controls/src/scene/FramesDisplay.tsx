/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useFrames, useSelectedFrame } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { CartesianPositionTriadDisplay } from "./CartesianPositionTriadDisplay"
import { useConfigLiveEdit } from "../config/ConfigLiveEditProvider"

export const FramesDisplay = () => {
    const editedFrames = useConfigLiveEdit().frames
    const { asList: frames } = useFrames(editedFrames)
    const [selectedFrame, setSelectedFrame] = useSelectedFrame()

    return (
        <>
            {frames.map((f, i) => {
                const { translation, rotation } = f.absolute
                const { x, y, z } = translation
                const { x: qx, y: qy, z: qz, w } = rotation

                return (
                    <CartesianPositionTriadDisplay
                        key={i}
                        name={f.name}
                        translation={new Vector3(x, y, z)}
                        rotation={new Quaternion(qx, qy, qz, w)}
                        size="regular"
                        onClick={() => setSelectedFrame(i)}
                        selected={selectedFrame === i}
                    />
                )
            })}
        </>
    )
}
