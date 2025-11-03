import { useGLTF } from "@react-three/drei"
import { useJointPositions } from "@glowbuzzer/store"

export const CentrifugeLid = () => {
    const [lid_model] = useGLTF(["/assets/laboratory centrifuge lid-transformed.glb"]).map(
        m => m.scene
    )

    const [lid_position] = useJointPositions(2)

    return (
        <group rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[1.4, 0.3, -0.5 + lid_position]}>
            <primitive object={lid_model} />
        </group>
    )
}
