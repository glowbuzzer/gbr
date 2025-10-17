import * as React from "react"
import { useEffect, useRef } from "react"
import { SpotLight, SpotLightHelper } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { TriadHelper } from "@glowbuzzer/controls"

export const CustomSpotLighting = ({
    position,
    targetPosition = [0, 0, 0],
    angle = 0.5,
    intensity = 10
}) => {
    const lightRef = useRef<SpotLight>()
    const helperRef = useRef<SpotLightHelper>()
    const { scene } = useThree()

    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.target.position.set(
                targetPosition[0],
                targetPosition[1],
                targetPosition[2]
            )
            helperRef.current = new SpotLightHelper(lightRef.current, "#660000")
            lightRef.current.parent.add(helperRef.current)

            return () => {
                helperRef.current.parent?.remove(helperRef.current)
                helperRef.current.dispose()
            }
        }
    }, [scene])

    return (
        <spotLight
            position={position}
            castShadow
            ref={lightRef}
            intensity={intensity}
            angle={angle}
            // penumbra={0.5}
            distance={0}
        />
    )
}
