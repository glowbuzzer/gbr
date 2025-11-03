import * as React from "react"

export type StripLightProps = {
    position?: [number, number, number]
    rotation?: [number, number, number]
    length?: number
    width?: number
    depth?: number
    segments?: number
    emissiveColor?: string
    emissiveIntensity?: number
    lightColor?: string
    lightIntensity?: number
    lightDistance?: number
    lightDecay?: number
}

/**
 * A fluorescent strip light consisting of an emissive bar and a line of subtle point lights
 * to approximate diffuse area lighting.
 */
export const StripLight: React.FC<StripLightProps> = ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    length = 0.2,
    width = 0.006,
    depth = 0.02,
    segments = 4,
    emissiveColor = "#00ff00", // soft green
    emissiveIntensity = 1.2,
    lightColor = "#aaffaa", // soft green
    lightIntensity = 0.35,
    lightDistance = 1.4,
    lightDecay = 2
}) => {
    const half = length / 2

    return (
        <group position={position} rotation={rotation}>
            {/* Emissive diffuser bar to visualize the strip */}
            <mesh>
                <boxGeometry args={[length, width, depth]} />
                <meshStandardMaterial
                    emissive={emissiveColor as any}
                    emissiveIntensity={emissiveIntensity}
                    color={emissiveColor as any}
                    toneMapped={false}
                />
            </mesh>

            {/* Array of subtle point lights along the strip to simulate diffuse fluorescent illumination */}
            {Array.from({ length: segments }).map((_, i) => {
                const t = segments === 1 ? 0.5 : i / (segments - 1)
                const x = -half + t * length
                return (
                    <pointLight
                        key={i}
                        color={lightColor as any}
                        intensity={lightIntensity}
                        distance={lightDistance}
                        decay={lightDecay}
                        position={[x, 0, 0]}
                    />
                )
            })}
        </group>
    )
}
