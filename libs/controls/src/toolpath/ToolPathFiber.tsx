import * as React from "react"
import { useEffect, useMemo, useRef } from "react"
import { extend, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"
import { Euler, Float32BufferAttribute, Vector3 } from "three"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"
import { Line, Text } from "@react-three/drei"

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

const DrawingExtent = ({ label, position, distance, rotation }: { label: string; position: Vector3; distance: number; rotation: Euler }) => {
    const OFFSET = 10

    if (Math.abs(distance) < 0.00001) {
        return null
    }
    const points = [
        position,
        position.clone().add(new Vector3(0, -OFFSET, 0)),
        position.clone().add(new Vector3(distance, -OFFSET, 0)),
        position.clone().add(new Vector3(distance, 0, 0))
    ].map(v => [v.x, v.y, v.z] as [number, number, number])

    // noinspection RequiredAttributes
    return (
        <group position={position} rotation={rotation}>
            <Line color="#909090" points={points} dashed={true} dashSize={5} />
            <Text
                position={new Vector3(0, -OFFSET, 0)}
                color={"#909090"}
                fontSize={10}
                maxWidth={100}
                lineHeight={1}
                letterSpacing={0}
                textAlign={"left"}
                font="arial"
                anchorX="left"
                anchorY="top"
            >
                {label} {distance.toFixed(2)} mm
            </Text>
        </group>
    )
}

export const PreviewPath = ({ preview }) => {
    const previewPoints = useMemo(() => preview.map(s => [toVector3(s.from), toVector3(s.to)]).flat(), [preview])

    // calculate lower and upper limits of all points
    const boundingBox = useMemo(
        () =>
            preview.reduce(
                (boundingBox, point) => {
                    boundingBox[0] = Math.min(boundingBox[0], point.from[0], point.to[0])
                    boundingBox[1] = Math.min(boundingBox[1], point.from[1], point.to[1])
                    boundingBox[2] = Math.min(boundingBox[2], point.from[2], point.to[2])
                    boundingBox[3] = Math.max(boundingBox[3], point.from[0], point.to[0])
                    boundingBox[4] = Math.max(boundingBox[4], point.from[1], point.to[1])
                    boundingBox[5] = Math.max(boundingBox[5], point.from[2], point.to[2])
                    return boundingBox
                },
                [0, 0, 0, 0, 0, 0]
            ),
        [preview]
    )

    const colors = useMemo(() => {
        const floats = preview.flatMap(s => [s.color, s.color].flat())
        return new Float32BufferAttribute(floats, 3)
    }, [preview])

    // noinspection RequiredAttributes
    return useMemo(
        () => (
            <>
                <lineSegments>
                    <bufferGeometry
                        onUpdate={geom => {
                            geom.addAttribute("color", colors)
                            geom.setFromPoints(previewPoints)
                        }}
                    />
                    <lineBasicMaterial vertexColors={true} linewidth={1} />
                </lineSegments>
                <DrawingExtent label="X" position={new Vector3(0, 0, 0)} distance={boundingBox[3] - boundingBox[0]} rotation={new Euler()} />
            </>
        ),
        [previewPoints, colors, boundingBox]
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
