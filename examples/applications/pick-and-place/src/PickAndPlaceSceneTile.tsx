import React, { Suspense } from "react"
import { StaubliRobot } from "../../../util/StaubliRobot"
import { ThreeDimensionalSceneTile } from "@glowbuzzer/controls"
import { BlockStack } from "./BlockStack"
import { useAppState } from "./store"
import { Block } from "./Block"
import { Vector3 } from "three"
import { Environment } from "@react-three/drei"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

export const PickAndPlaceSceneTile = () => {
    const { leftBlocks, rightBlocks, pick } = useAppState()

    return (
        <ThreeDimensionalSceneTile hideTrace>
            <Suspense fallback={null}>
                <StaubliRobot kinematicsConfigurationIndex={0}>
                    {pick && <Block position={new Vector3(0, 0, 50)} />}
                </StaubliRobot>
                <PlaneShinyMetal />
                <BlockStack count={leftBlocks} position={[300, 0, 50]} />
                <BlockStack count={rightBlocks} position={[0, 300, 50]} />
                <DefaultEnvironment />
            </Suspense>
        </ThreeDimensionalSceneTile>
    )
}
