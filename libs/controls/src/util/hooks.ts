/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    JointConfig,
    MachineState,
    useConfig,
    useConnection,
    useJointConfigurationList,
    useKinematicsConfiguration,
    useMachineState,
    WithNameAndDescription
} from "@glowbuzzer/store"
import { useHandGuidedMode } from "../handguided/hooks"

export function useJointsForKinematicsConfigurationList(kinematicsConfigurationIndex: number): {
    index: number
    config: WithNameAndDescription<JointConfig>
}[] {
    const joints = useJointConfigurationList()
    const kinematicsConfiguration = useKinematicsConfiguration(kinematicsConfigurationIndex)

    return kinematicsConfiguration.participatingJoints.map(jointIndex => ({
        index: jointIndex,
        config: joints[jointIndex]
    }))
}

export function useOperationEnabled() {
    const machineState = useMachineState()
    return machineState === MachineState.OPERATION_ENABLED
}

export function useScale() {
    const config = useConfig()
    const extent = config.$metadata?.workspaceSize || 2000 // default to 2m
    return { extent }
}
