import * as React from "react"
import { useEffect, useRef } from "react"
import { SpotLight, SpotLightHelper, Vector2 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { TriadHelper } from "@glowbuzzer/controls"

export const CustomSpotLighting = ({
    position,
    targetPosition = [0, 0, 0],
    angle = 0.5,
    intensity = 10
}) => {
    const lightRef = useRef<SpotLight>(null)
    const helperRef = useRef<SpotLightHelper>(null)

    useEffect(() => {
        // if (lightRef.current) {
        //     lightRef.current.target.position.set(
        //         targetPosition[0],
        //         targetPosition[1],
        //         targetPosition[2]
        //     )
        //     lightRef.current.shadow.mapSize.set(2048, 2048)
        //     lightRef.current.shadow.normalBias = 0.02
        //
        //     helperRef.current = new SpotLightHelper(lightRef.current, "#660000")
        //     lightRef.current.parent.add(helperRef.current)
        //
        //     return () => {
        //         helperRef.current.parent?.remove(helperRef.current)
        //         helperRef.current.dispose()
        //     }
        // }
    }, [targetPosition])

    return (
        <spotLight
            position={position}
            castShadow
            ref={lightRef}
            intensity={intensity}
            angle={angle}
            penumbra={0.1}
            distance={100}
        />
    )
}
