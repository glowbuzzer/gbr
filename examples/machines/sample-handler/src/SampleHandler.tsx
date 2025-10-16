import { useGLTF } from "@react-three/drei"
import { useRawJointPositions } from "@glowbuzzer/store"
import { Mesh } from "three"
import { useMemo } from "react"

export const SampleHandler = ({ children }) => {
    const [x, y, z, r] = useRawJointPositions()

    return (
        <SampleHandlerModel x={x} y={y} z={z} r={r} scale={1000}>
            {children}
        </SampleHandlerModel>
    )
}

export const SampleHandlerModel = ({ x, y, z, r, scale = 1, deMetal = false, children = null }) => {
    const parts = useGLTF([
        "/assets/base.glb",
        "/assets/x.glb",
        "/assets/y.glb",
        "/assets/z - no rotation.glb",
        "/assets/z - rotation.glb"
    ])

    const [base, x_model, y_model, z_norot, z_rot] = useMemo(
        () =>
            parts.map(m => {
                const scene = m.scene
                scene.traverse((o: Mesh) => {
                    const material = o.material as any
                    if (o.isMesh && material && material.isMeshStandardMaterial) {
                        if (!o.userData.__backup) {
                            o.userData.__backup = material.clone()
                        }
                        if (deMetal) {
                            material.metalness = 0
                            material.roughness = 0
                        } else {
                            material.metalness = o.userData.__backup.metalness
                            material.roughness = o.userData.__backup.roughness
                        }
                    }
                })
                return scene
            }),
        [parts, deMetal]
    )

    return (
        <group scale={scale}>
            <primitive object={base} rotation={[Math.PI, 0, Math.PI / 2]} />
            <group position={[0.95, y, 0.635]}>
                <primitive object={y_model} rotation={[Math.PI, 0, Math.PI / 2]} />
                <group position={[x, 0, 0]}>
                    <primitive object={x_model} rotation={[Math.PI, 0, Math.PI / 2]} />
                    <group position={[-0.65, 0.15, 0.1 + z]}>
                        <primitive object={z_norot} rotation={[Math.PI, 0, Math.PI / 2]} />
                        <group position={[0, 0.055, -0.389]} rotation={[0, 0, r]}>
                            <primitive object={z_rot} rotation={[-Math.PI / 2, 0, 0]} />
                            <group scale={1 / scale} position={[0, 0, -0.011]}>
                                {children}
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
