import { SampleHandler } from "./SampleHandler"
import { SampleTube } from "./SampleTube"
import { PerspectiveCamera, Sphere, useContextBridge } from "@react-three/drei"
import * as React from "react"
import { ReactReduxContext } from "react-redux"
import { CanvasFancy } from "./CanvasFancy"
import { SampleLocation, useSampleState } from "./store"
import { SampleTubeAtLocation } from "./SampleTubeAtLocation"
import { FrameHelper } from "../../../util/FrameHelper"
import { CartesianPositionHelper } from "../../../util/CartesianPositionHelper"
import { TriadHelper } from "@glowbuzzer/controls"
import { WorldPosition } from "../../../../vendors/ibt/apps/awtube-urdfviz/src/WorldPosition"

export const Scene = ({ showPositionHelpers = false }) => {
    const ContextBridge = useContextBridge(ReactReduxContext)
    const { location } = useSampleState()

    return (
        <CanvasFancy
            environment
            envMapIntensity={0.2}
            lightingIntensity={5}
            deMetal
            castShadow
            spotLight
            directionalLight
            frameloop="demand"
        >
            <ContextBridge>
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

                <PerspectiveCamera
                    makeDefault
                    position={[3, 3, 5]}
                    // far={10000}
                    // near={1}
                    // up={[0, 0, 1]}
                />
            </ContextBridge>
        </CanvasFancy>
    )
}
