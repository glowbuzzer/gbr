import { useKinematicsCartesianPosition } from "@glowbuzzer/store"

export const CartesianPositionHelper = ({ children }: { children: React.ReactNode }) => {
    const { position } = useKinematicsCartesianPosition(0)

    const { translation, rotation } = position

    return (
        <group
            position={[translation.x, translation.y, translation.z]}
            quaternion={[rotation.x, rotation.y, rotation.z, rotation.w]}
        >
            {children}
        </group>
    )
}
