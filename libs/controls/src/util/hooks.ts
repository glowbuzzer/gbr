/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useJointConfigurationList, useKinematicsConfiguration } from "@glowbuzzer/store"

export function useJointsForKinematicsConfiguration(kineamticsConfigurationIndex: number) {
    const joints = useJointConfigurationList()
    const kinematicsConfiguration = useKinematicsConfiguration(kineamticsConfigurationIndex)

    return kinematicsConfiguration.participatingJoints.map(jointIndex => ({
        index: jointIndex,
        config: joints[jointIndex]
    }))
}
