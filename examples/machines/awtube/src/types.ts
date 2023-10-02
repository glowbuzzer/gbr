/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Group } from "three"

export type PartDefinition = {
    name: string
    filename: string
    // translation: number[]
}
export type LoadedPartDefinition<T> = T & {
    object: Group
}
export type PartDefinitionForBase = PartDefinition & {
    thickness: number
}
export type PartDefinitionForJoint = PartDefinition & {
    moveableFlangeFromCentreLine: number
    fixedFlangeFromCentreLine: number
}
export type PartDefinitionForMonobraccio = PartDefinition & {
    length: number
    offset: number
}
export type PartDefinitionForLink = PartDefinition & {
    length: number
}
export type PartDefinitionForFlange = PartDefinition & {
    offset: number
}
export type PartDefinitionForClamp = PartDefinition & {
    thickness: number
}
export type PartDefinitionForSpindle = PartDefinition & {
    thickness: number
}
export type LoadedRobotDefinition = [
    LoadedPartDefinition<PartDefinitionForBase>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForClamp>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForFlange>,
    LoadedPartDefinition<PartDefinitionForLink>,
    LoadedPartDefinition<PartDefinitionForFlange>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForClamp>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForFlange>,
    LoadedPartDefinition<PartDefinitionForLink>,
    LoadedPartDefinition<PartDefinitionForFlange>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForMonobraccio>,
    LoadedPartDefinition<PartDefinitionForJoint>,
    LoadedPartDefinition<PartDefinitionForSpindle>
]
