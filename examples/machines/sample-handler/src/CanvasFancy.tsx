import { Canvas, RenderProps } from "@react-three/fiber"
import { NoToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three"
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing"
import { TriadHelper } from "@glowbuzzer/controls"
import { Environment, useContextBridge } from "@react-three/drei"
import { CustomSpotLighting } from "./CustomSpotLighting"
import { CustomPointLighting } from "./CustomPointLighting"
import { SceneSettings } from "./settings"
import { ReactNode } from "react"
import { ReactReduxContext } from "react-redux"

export const CanvasFancy = ({
    hemisphereLight,
    envMapIntensity,
    lightingIntensity,
    directionalLight,
    ambientLight,
    pointLight,
    spotLight,
    grid,
    environment,
    frameloop = "demand",
    children
}: SceneSettings & { frameloop?: RenderProps<any>["frameloop"]; children?: ReactNode }) => {
    const ContextBridge = useContextBridge(ReactReduxContext)

    return (
        <Canvas
            shadows
            frameloop={frameloop}
            gl={{
                antialias: true,
                toneMapping: NoToneMapping,
                shadowMapEnabled: true,
                shadowMapType: PCFSoftShadowMap,
                outputColorSpace: SRGBColorSpace
            }}
        >
            <ContextBridge>
                <EffectComposer>
                    <DepthOfField
                        focusDistance={0.01}
                        focalLength={0.05}
                        bokehScale={2}
                        height={480}
                    />
                    <Bloom luminanceThreshold={500} luminanceSmoothing={10000} height={600} />
                    {/*
                <SelectiveBloom
                    intensity={3.5} // LED-only bloom strength
                    luminanceThreshold={0} // ignore thresholding; we select explicitly
                    luminanceSmoothing={0.0}
                    radius={0.8}
                />
*/}
                    {/*
                        <N8AO aoRadius={5} intensity={1} />
                        <FXAA />
                        <Noise opacity={0} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                */}
                </EffectComposer>

                {/*
                    <renderPass />
                    <shaderPass
                        args={[FXAAShader]}
                        material-uniforms-resolution-value={[1 / 1000, 1 / 1000]}
                        renderToScreen
                    />
                    <shaderPass args={[GammaCorrectionShader]} />
            */}

                {/* circle on the floor to receive shadows */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <circleGeometry args={[6, 64]} />
                    <shadowMaterial transparent opacity={0.5} />
                </mesh>

                {hemisphereLight && <hemisphereLight intensity={lightingIntensity / 25} />}
                {ambientLight && <ambientLight intensity={lightingIntensity / 25} />}
                {spotLight && (
                    <CustomSpotLighting
                        position={[2, 2, 5]}
                        targetPosition={[1, 0, 0]}
                        intensity={lightingIntensity * 10}
                    />
                )}
                {directionalLight && (
                    <directionalLight
                        position={[1, 1, 1]}
                        intensity={lightingIntensity / 10}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        shadow-bias={-0.0002}
                        shadow-normalBias={0.02}
                    />
                )}
                {pointLight && (
                    <CustomPointLighting position={[1, 1, 2]} intensity={lightingIntensity} />
                )}

                <color attach="background" args={["#333"]} />

                {grid && <gridHelper args={[1000, 1000, 0x888888, 0x888888]} />}

                {environment && (
                    <Environment preset="studio" blur={5} environmentIntensity={envMapIntensity} />
                )}

                {children}
            </ContextBridge>
        </Canvas>
    )
}
