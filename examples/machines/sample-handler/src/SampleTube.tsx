import { useGLTF } from "@react-three/drei"

export const SampleTube = () => {
    const [tube] = useGLTF(["/assets/sample_tube_qr.glb"]).map(m => m.scene)

    return (
        <group scale={1000} position={[0, 0, -135]}>
            <primitive object={tube} rotation={[0, -Math.PI / 2, 0]} />
        </group>
    )
}
