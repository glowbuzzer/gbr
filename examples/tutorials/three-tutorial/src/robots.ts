/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import { Object3D } from "three"

export type RobotKinematicsChainElement = {
    moveable?: boolean // will be moved by joint position
    jointAngleAdjustment?: number // adjustment to make to joint angle to match robot kinematics
    translateX?: number
    translateY?: number
    translateZ?: number
    rotateX?: number
    rotateY?: number
    rotateZ?: number
}
