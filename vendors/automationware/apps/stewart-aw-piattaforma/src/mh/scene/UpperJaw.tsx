import { useMechHumanContext } from "../MechHumanContextProvider"
import { calc_centroid } from "../motion"
import { TriadHelper } from "@glowbuzzer/controls"

export const UpperJaw = () => {
    const { upperJaw, upperPosition } = useMechHumanContext()

    if (!upperJaw) {
        return null
    }

    const { mark_1, mark_2, mark_3 } = upperPosition
    const position = calc_centroid([mark_1, mark_2, mark_3])
    const { x, y, z } = position
    return (
        <group position={[x, y, 370 + z]} rotation={[0, Math.PI, 0]}>
            <mesh geometry={upperJaw}>
                <meshPhysicalMaterial envMapIntensity={0.2} metalness={1} roughness={0.2} />
            </mesh>
        </group>
    )
}
