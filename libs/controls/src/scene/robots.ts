/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"

type RobotConfig = {
    teta?: number
    offset?: number
    alpha?: number
    link_length?: number
    limits?: number[]
    skip_link?: boolean
}[]

export type RobotModel = {
    name: string
    config: RobotConfig
    offset: THREE.Vector3
    scale: number
}
