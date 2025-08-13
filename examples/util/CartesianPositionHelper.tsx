import { useKinematicsCartesianPosition } from "@glowbuzzer/store"

type CartesianPositionHelperProps = {
    kinematicsConfigurationIndex?: number
    children: React.ReactNode
}

export const CartesianPositionHelper = ({
    kinematicsConfigurationIndex = 0,
    children
}: CartesianPositionHelperProps) => {
    const { position } = useKinematicsCartesianPosition(kinematicsConfigurationIndex)

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
