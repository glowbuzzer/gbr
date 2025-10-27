import { Environment } from "@react-three/drei"

export const CustomEnvironment = () => {
    return (
        <Environment
            preset="studio"
            blur={5}
            background={false}
            environmentRotation={[0, 0, Math.PI / 2]}
        />
    )
}
