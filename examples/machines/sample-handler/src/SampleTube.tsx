import { useGLTF } from "@react-three/drei"

export const SampleTube = () => {
    const [tube] = useGLTF(["/assets/sample_tube_qr3-transformed.glb"]).map(m => m.scene)

    return (
        <group scale={1} rotation={[0, 0, Math.PI / 2]}>
            <primitive object={tube} />
        </group>
    )
}
