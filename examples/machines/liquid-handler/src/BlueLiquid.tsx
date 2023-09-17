import { Box } from "@react-three/drei"

export const BlueLiquid = props => {
    const level = props.level * 0.01

    const args = [0.009, 0.009, level]
    const position = [0.195, 0.075, 0.002 + level / 2]

    const spacing = 0.0085
    return (
        <>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1], position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing, position[2]]}
            >
                009
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 2, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 3, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 4, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 5, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 6, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 7, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
            <Box
                args={[args[0], args[1], args[2]]}
                position={[position[0], position[1] + spacing * 8, position[2]]}
            >
                <meshBasicMaterial attach="material" color="blue" />
            </Box>
        </>
    )
}
