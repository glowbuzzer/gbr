/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    JointConfig,
    MachineState,
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

/**
 * @deprecated This hook may be removed in the future
 */
export function useMotionAllowed(): boolean {
    const { connected } = useConnection()
    const machineState = useMachineState()
    const { handGuidedModeActive } = useHandGuidedMode()

    return connected && machineState === "OPERATION_ENABLED" && !handGuidedModeActive
}

export function useOperationEnabled() {
    const machineState = useMachineState()
    return machineState === MachineState.OPERATION_ENABLED
}
