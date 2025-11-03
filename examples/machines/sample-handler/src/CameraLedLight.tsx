import { Color, MeshStandardMaterial } from "three"
import { Cylinder } from "@react-three/drei"
import { useMemo } from "react"
import { SampleLocation, useSampleState } from "./store"

const num_lights = 8
const radius = 0.03
const light_radius = 0.005

export const CameraLedLight = ({ position }: { position: [number, number, number] }) => {
    const { location } = useSampleState()

    const material = useMemo(
        () =>
            new MeshStandardMaterial({
                emissive: new Color(0xffff00),
                emissiveIntensity: 3,
                toneMapped: false,
                color: 0xffff00
            }),
        []
    )

    return (
        <group position={position}>
            {Array.from({ length: num_lights }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / num_lights
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                return (
                    <group key={i}>
                        <Cylinder
                            args={[light_radius, light_radius, 0.01, 16, 16]}
                            position={[x, y, 0]}
                            material={material}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            {location === SampleLocation.CAMERA && (
                                <pointLight color="#ffff66" intensity={0.01} distance={0.3} />
                            )}
                        </Cylinder>
                    </group>
                )
            })}
        </group>
    )
}
