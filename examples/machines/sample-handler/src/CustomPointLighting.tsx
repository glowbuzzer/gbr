import * as React from "react"
import { useEffect, useRef } from "react"
import { PointLight, PointLightHelper, SpotLight, SpotLightHelper } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { TriadHelper } from "@glowbuzzer/controls"

export const CustomPointLighting = ({ position, intensity = 10 }) => {
    const lightRef = useRef<PointLight>(null)
    const helperRef = useRef<PointLightHelper>(null)
    const { scene } = useThree()

    useEffect(() => {
        if (lightRef.current) {
            helperRef.current = new PointLightHelper(lightRef.current, 0.1)
            lightRef.current.parent.add(helperRef.current)

            return () => {
                helperRef.current.parent?.remove(helperRef.current)
                helperRef.current.dispose()
            }
        }
    }, [scene])

    return <pointLight position={position} ref={lightRef} intensity={intensity} castShadow />
}
