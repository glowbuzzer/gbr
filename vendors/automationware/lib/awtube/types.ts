/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Group } from "three"

// all parts have a filename, which is the path to the GLTF model
export type PartDefinition = {
    filename: string
}

// once a part is loaded, it has an object (instance of THREE.Group)
export type LoadedPartDefinition<T> = T & {
    object: Group
}

export type PartDefinitionForBase = PartDefinition & {
    // height of the base
    thickness: number
}

export type PartDefinitionForJoint = PartDefinition & {
    // distance from the centre line of the joint to the centre line of the fixed flange
    moveableFlangeFromCentreLine: number
    // distance from the centre line of the joint to the centre line of the moveable flange
    fixedFlangeFromCentreLine: number
}

export type PartDefinitionForMonobraccio = PartDefinition & {
    // distance from the axis of the first joint mounting position to the axis of the second joint mounting position
    length: number
    // distance from the plane of the first joint mounting position to the plane of the second joint mounting position
    offset: number
}

export type PartDefinitionForLink = PartDefinition & {
    // length of the link (tube)
    length: number
}

export type PartDefinitionForFlange = PartDefinition & {
    // distance from the face of the flange to the inserted tube end point
    offset: number
}

export type PartDefinitionForClamp = PartDefinition & {
    // distance between the two faces of the clamp
    thickness: number
}

export type PartDefinitionForSpindle = PartDefinition & {
    // distance between the top of the spindle and the face mounted to the joint
    thickness: number
}

// these are the parts that make up a robot, before the model files are loaded
export type AwTubeRobotParts = {
    b0: PartDefinitionForBase
    j0: PartDefinitionForJoint
    c0: PartDefinitionForClamp
    j1: PartDefinitionForJoint
    f0: PartDefinitionForFlange
    l0: PartDefinitionForLink
    f1: PartDefinitionForFlange
    j2: PartDefinitionForJoint
    c1: PartDefinitionForClamp
    j3: PartDefinitionForJoint
    f2: PartDefinitionForFlange
    l1: PartDefinitionForLink
    f3: PartDefinitionForFlange
    j4: PartDefinitionForJoint
    m0: PartDefinitionForMonobraccio
    j5: PartDefinitionForJoint
    s0: PartDefinitionForSpindle
}

// these are the parts that make up a robot, once the model files have been loaded
export type AwTubeLoadedRobotParts = {
    [K in keyof AwTubeRobotParts]: LoadedPartDefinition<AwTubeRobotParts[K]>
}

export enum DigitalInputs {
    SAFE_STOP,
    SW_STOP,
    POWER,
    RC_LIGHT,
    BR_CHOPPER_ERROR,
    TOOL1,
    TOOL2
}

export enum DigitalOutputs {
    HEARTBIT_1,
    HEARTBIT_2,
    SAFE_STOP,
    SW_STOP,
    SPARE,
    TOOL1,
    TOOL2
}
