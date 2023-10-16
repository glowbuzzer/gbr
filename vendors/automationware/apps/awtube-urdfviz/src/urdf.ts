/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Euler, Vector3 } from "three"

function make_frame(xyz, rpy) {
    const [x, y, z] = xyz.split(" ").map(parseFloat)
    const [roll, pitch, yaw] = rpy.split(" ").map(parseFloat)

    const position = new Vector3(x, y, z)
    const rotation = new Euler(roll, pitch, yaw, "ZYX")

    return {
        position,
        rotation
    }
}

export function parse_urdf_input(input) {
    const lines = input.split("\n")
    const frames = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith("<origin")) {
            const xyz = line.match(/xyz="([^"]*)"/)[1]
            const rpy = line.match(/rpy="([^"]*)"/)[1]
            frames.push(make_frame(xyz, rpy))
        }
    }
    return frames
}
