import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as React from "react"
import { useEffect, useMemo } from "react"
import { useFrames, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { Vector3 } from "three"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useSampleState } from "./store"

export const TrackingCamera = () => {
    const tcp = useKinematicsCartesianPosition(0)
    const { convertToFrame } = useFrames()
    const { trackingCamera } = useSampleState()

    const controls = React.useRef<OrbitControlsImpl>(null)

    const world = useMemo(() => {
        const translation = convertToFrame(
            tcp.position.translation,
            tcp.position.rotation,
            1,
            "world"
        ).translation

        return new Vector3(translation.x, translation.y, translation.z)
    }, [tcp.position.translation.x, tcp.position.translation.y, tcp.position.translation.z])

    useEffect(() => {
        if (trackingCamera) {
            const { y } = controls.current.target
            const { x: nx, z: nz } = world
            controls.current.target.set(nx, y, nz)
            controls.current.update()
        }
    }, [world, trackingCamera])

    return (
        <>
            <OrbitControls enableDamping={false} makeDefault ref={controls} />
            <PerspectiveCamera makeDefault position={[3, 3, 5]} />
        </>
    )
}
