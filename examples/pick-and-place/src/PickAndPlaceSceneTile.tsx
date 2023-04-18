import React, { Suspense } from "react"
import { StaubliRobot } from "../../util/staubli"
import { ThreeDimensionalSceneTile, useScale } from "@glowbuzzer/controls"
import { BlockStack } from "./BlockStack"
import { useSelector } from "react-redux"
import { AppState, useAppState } from "./store"
import { Block } from "./Block"
import { Vector3 } from "three"
import { Environment, Plane } from "@react-three/drei"

const SceneInner = () => {
    const { leftBlocks, rightBlocks, pick } = useAppState()
    const { extent } = useScale()
    const distance = extent * 2

    return (
        <>
            <StaubliRobot kinematicsConfigurationIndex={0}>
                {pick && <Block position={new Vector3(0, 0, 50)} />}
            </StaubliRobot>
            <Plane args={[distance, distance]} position={[0, 0, -1]}>
                <meshPhysicalMaterial envMapIntensity={1} metalness={0.05} roughness={0.1} />
            </Plane>
            <BlockStack count={leftBlocks} position={[300, 0, 50]} />
            <BlockStack count={rightBlocks} position={[0, 300, 50]} />
            <Environment files="/aerodynamics_workshop_1k.hdr" />
        </>
    )
}

export const PickAndPlaceSceneTile = () => {
    return (
        <ThreeDimensionalSceneTile hideTrace>
            <Suspense fallback={null}>
                <SceneInner />
            </Suspense>
        </ThreeDimensionalSceneTile>
    )
}
