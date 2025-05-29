import {
    AwTubeRobot,
    AwTubeRobotParts,
    Base,
    Clamp,
    Joint,
    Link,
    Monobraccio,
    Plate,
    Spindle,
    useLoadedRobotParts
} from "../../../../../vendors/ibt/awlib/src"
import { ActiveTool, TriadHelper } from "@glowbuzzer/controls"
import { Sphere } from "@react-three/drei"
import React from "react"

/*
const definition_l: AwTubeRobotParts = {
    b0: Base.MM219_27,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_514,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_494,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M250,
    j5: Joint.J20,
    s0: Spindle.M112
}
*/

const definition_l2: AwTubeRobotParts = {
    b0: Base.MM219,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_314,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_294,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M220,
    j5: Joint.J20,
    s0: Spindle.M112
}

export const LoadedRobot = () => {
    const parts = useLoadedRobotParts(definition_l2)

    return (
        <AwTubeRobot parts={parts}>
            <TriadHelper size={400} />
            <Sphere scale={10}>
                <meshStandardMaterial color="red" />
            </Sphere>
            <ActiveTool />
        </AwTubeRobot>
    )
}
