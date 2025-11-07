import { useGLTF } from "@react-three/drei"

export const SceneExtras = () => {
    const [e1, pipettes, machine, wellplate] = useGLTF([
        "/assets/erlenmeyerChemistryFlask-transformed.glb",
        "/assets/laboratory_pippete-transformed.glb",
        "/assets/pcr_machine-transformed.glb",
        "/assets/pcr_plate__free_3d__low_poly-transformed.glb"
    ]).map(m => m.scene)

    const [flask1, flask2, flask3] = [e1.clone(), e1.clone(), e1.clone()]

    return (
        <group>
            <primitive object={flask1} position={[1, 0.01, -1.6]} scale={3} />
            <primitive
                object={flask2}
                position={[0.8, 0.01, -1.7]}
                scale={3}
                rotation={[0, -Math.PI / 2, 0]}
            />
            <primitive
                object={flask3}
                position={[0.75, 0.01, -1.5]}
                scale={3}
                rotation={[0, -Math.PI / 5, 0]}
            />
            <group rotation={[Math.PI / 2, Math.PI / 2, Math.PI]} position={[0.1, 0.09, -1]}>
                <primitive object={pipettes} scale={0.04} rotation={[Math.PI / 7, 0, 0]} />
            </group>
            <primitive
                object={machine}
                scale={0.025}
                position={[0.1, 0, -1.2]}
                rotation={[0, Math.PI, 0]}
            />
            <primitive object={wellplate} scale={2.5} position={[0.4, 0.01, -0.8]} />
        </group>
    )
}
