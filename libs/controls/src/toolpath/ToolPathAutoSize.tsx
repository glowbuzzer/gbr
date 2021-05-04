import { useThree } from "react-three-fiber"
import * as React from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"

const CameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement }
    } = useThree()
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef(null)
    // useFrame(state => controls.current.update())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <orbitControls ref={controls} args={[camera, domElement]} />
}

export const ToolPathAutoSize = ({ extent, children }) => {
    const { size, setDefaultCamera } = useThree()

    useEffect(() => {
        const cam = new THREE.PerspectiveCamera(70, size.width / size.height, 0.01, 10000)
        cam.position.z = 2 * extent
        cam.up.set(0, 0, 1)
        setDefaultCamera(cam)
    }, [size, extent, setDefaultCamera])

    return (
        <>
            <CameraControls />
            {children}
        </>
    )
}
