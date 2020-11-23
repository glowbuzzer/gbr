import * as React from "react"
import { useEffect, useMemo, useRef } from "react"
import { extend, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"
import { Float32BufferAttribute, Vector3 } from "three"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"

// TODO: hack alert - cannot export from lib project??
declare type GCodeSegment = any

extend({ OrbitControls })

function toVector3(vals: number[]) {
    const [x, y, z] = vals
    return new Vector3(x, y, z)
}

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

export const PreviewPath = ({ preview }) => {
    const previewPoints = useMemo(() => {
        const flat = preview.map(s => [toVector3(s.from), toVector3(s.to)]).flat()
        return flat
    }, [preview])

    const colors = useMemo(() => {
        const floats = preview.flatMap(s => [s.color, s.color].flat())
        return new Float32BufferAttribute(floats, 3)
    }, [preview])

    return useMemo(
        () => (
            <lineSegments>
                <bufferGeometry
                    onUpdate={geom => {
                        geom.addAttribute("color", colors)
                        geom.setFromPoints(previewPoints)
                    }}
                />
                <lineBasicMaterial vertexColors={true} linewidth={1} />
            </lineSegments>
        ),
        [previewPoints, colors]
    )
}

export const ToolPath = ({ path }) => {
    const pathPoints = simplify(path, 0.01).flatMap(p => [p.x, p.y, p.z])
    // noinspection RequiredAttributes
    return (
        <DynamicLine
            points={pathPoints} // Array of points
            color={"red"}
            lineWidth={2} // In pixels (default)
        />
    )
}
