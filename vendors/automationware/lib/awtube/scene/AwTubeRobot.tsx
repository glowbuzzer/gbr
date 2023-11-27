/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useFrame, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { AwTubeLoadedRobotParts } from "../types"
import { AwKinematicsGroup } from "./AwKinematicsGroup"
import { AwTubeBaseLink } from "./links/AwTubeBaseLink"
import { AwTubeLink1 } from "./links/AwTubeLink1"
import { AwTubeLink2 } from "./links/AwTubeLink2"
import { AwTubeLink3 } from "./links/AwTubeLink3"
import { AwTubeLink4 } from "./links/AwTubeLink4"
import { AwTubeLink5 } from "./links/AwTubeLink5"
import { AwTubeLink6 } from "./links/AwTubeLink6"
import { AwTubeKinChainProvider } from "../AwTubeKinChainProvider"

type AwTubeRobotProps = {
    children?: React.ReactNode
    parts: AwTubeLoadedRobotParts
    showFrames?: boolean
}

/**
 * This component renders a complete AwTube robot from the given definition (the individual parts).
 * @param definition The robot parts
 * @param children Any children to render at the end of the kinematic chain
 */
export const AwTubeRobot = ({ children = null, parts, showFrames }: AwTubeRobotProps) => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    // This the position and rotation of the robot in the scene, from the robot's frame configuration
    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    // load the parts
    // const parts = useMemo(() => useLoadedRobotParts(definition), [definition])

    // prettier-ignore
    // Render the complete chain
    return (
        <AwTubeKinChainProvider kinematicsConfigurationIndex={0} showFrames={showFrames}>
            <group position={position} quaternion={quaternion} scale={1000}>
                <AwTubeBaseLink parts={parts} />
                <AwKinematicsGroup jointIndex={0} link={<AwTubeLink1 parts={parts} />}>
                    <AwKinematicsGroup jointIndex={1} link={<AwTubeLink2 parts={parts} />}>
                        <AwKinematicsGroup jointIndex={2} link={<AwTubeLink3 parts={parts} />}>
                            <AwKinematicsGroup jointIndex={3} link={<AwTubeLink4 parts={parts} />}>
                                <AwKinematicsGroup jointIndex={4} link={<AwTubeLink5 parts={parts} />}>
                                    <AwKinematicsGroup jointIndex={5} link={<AwTubeLink6 parts={parts} />}>
                                        <group scale={1 / 1000}>
                                            {children}
                                        </group>
                                    </AwKinematicsGroup>
                                </AwKinematicsGroup>
                            </AwKinematicsGroup>
                        </AwKinematicsGroup>
                    </AwKinematicsGroup>
                </AwKinematicsGroup>
            </group>
        </AwTubeKinChainProvider>
    );
}
