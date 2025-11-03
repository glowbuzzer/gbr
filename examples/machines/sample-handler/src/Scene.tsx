import { SampleHandler } from "./SampleHandler"
import { SampleTube } from "./SampleTube"
import { OrbitControls, useContextBridge } from "@react-three/drei"
import * as React from "react"
import { ReactReduxContext } from "react-redux"
import { CanvasFancy } from "./CanvasFancy"
import { SampleLocation, useSampleState } from "./store"
import { SampleTubeAtLocation } from "./SampleTubeAtLocation"
import { FrameHelper } from "../../../util/FrameHelper"
import { CartesianPositionHelper } from "../../../util/CartesianPositionHelper"
import { TriadHelper } from "@glowbuzzer/controls"
import { WorldPosition } from "../../../../vendors/ibt/apps/awtube-urdfviz/src/WorldPosition"
import { TrackingCamera } from "./TrackingCamera"
import { CameraLedLight } from "./CameraLedLight"
import { CentrifugeLid } from "./CentrifugeLid"
import { StripLight } from "./StripLight"

export const Scene = ({ showPositionHelpers = false }) => {
    const { location, centrifugeRunning } = useSampleState()

    return (
        <CanvasFancy
            environment
            envMapIntensity={0.2}
            lightingIntensity={5}
            deMetal
            castShadow
            ambientLight
            spotLight
            directionalLight
            frameloop="demand"
        >
            {showPositionHelpers && (
                <FrameHelper frameName="machine">
                    <CartesianPositionHelper>
                        <WorldPosition title="Kins" position="right" />
                        <TriadHelper size={0.1} />
                    </CartesianPositionHelper>
                </FrameHelper>
            )}
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <SampleHandler>
                    {location === SampleLocation.ROBOT && (
                        <group position={[0, -0.135, 0]}>
                            <SampleTube />
                        </group>
                    )}
                </SampleHandler>
            </group>
            <SampleTubeAtLocation />
            <CentrifugeLid />

            <TrackingCamera />
            <CameraLedLight position={[0.72, 0.31, -0.55]} />

            {centrifugeRunning && <StripLight position={[1.404, 0.117, -0.19]} />}
        </CanvasFancy>
    )
}
