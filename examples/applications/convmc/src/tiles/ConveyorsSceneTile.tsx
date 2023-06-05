/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { forwardRef, Suspense, useMemo, useRef } from "react"
import { ThreeDimensionalSceneTile } from "@glowbuzzer/controls"
import { PerspectiveCamera, useGLTF } from "@react-three/drei"
import { PlaneShinyMetal } from "../../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../../util/DefaultEnvironment"
import { PneumaticCylinder } from "../components/PneumaticCylinder"
import { ObjectOnConveyor } from "../components/ObjectOnConveyor"
import { EffectComposer, GodRays } from "@react-three/postprocessing"
import { BlendFunction, KernelSize } from "postprocessing"
import { Conveyor, ConveyorBelt } from "../components/ConveyorAnimated"
import { MagicEye } from "../components/MagicEye"
import { AppWorkflow } from "../AppWorkflow"
import { OverheadCamera } from "../components/OverheadCamera"
import { useAppState } from "../store"
import { useDigitalOutputState } from "@glowbuzzer/store"
import { DigitalOutput } from "../constants"
import { Vector3 } from "three"
import { Laser } from "../components/Laser"

const INITIAL_CAMERA_POSITION = new Vector3(-600, 600, 700)

export const ConveyorsSceneTile = () => {
    const [{ effectiveValue: overheadCamera }] = useDigitalOutputState(DigitalOutput.CAMERA_TRIGGER)

    return (
        <ThreeDimensionalSceneTile
            noControls={overheadCamera}
            initialCameraPosition={INITIAL_CAMERA_POSITION}
        >
            <AppWorkflow />
            <Suspense fallback={null}>
                <group position={[-200, 0, 0]}>
                    <group scale={[1000, 1000, 1000]}>
                        <Conveyor jointIndex={0} rotateBelt />
                        <group position={[0.45, 0.11, 0]}>
                            <Conveyor jointIndex={1} rotateConveyor />
                        </group>
                        <PneumaticCylinder />
                        <MagicEye />
                    </group>
                    <ObjectOnConveyor />
                    <OverheadCamera />
                    <Laser />
                </group>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </Suspense>
        </ThreeDimensionalSceneTile>
    )
}
