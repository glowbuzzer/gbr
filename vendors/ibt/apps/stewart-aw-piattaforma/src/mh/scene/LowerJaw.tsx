import { useMechHumanContext } from "../MechHumanContextProvider"

export const LowerJaw = () => {
    const { lowerJaw } = useMechHumanContext()

    if (!lowerJaw) {
        return null
    }

    return (
        <group position={[0, 0, 20]}>
            <mesh geometry={lowerJaw}>
                <meshPhysicalMaterial envMapIntensity={0.2} metalness={1} roughness={0.2} />
            </mesh>
        </group>
    )
}
