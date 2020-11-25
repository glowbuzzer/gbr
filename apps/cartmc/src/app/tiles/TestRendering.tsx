import React, { useEffect, useRef, useState } from "react"
import { extend, useFrame, useThree } from "react-three-fiber"
import { Euler, PerspectiveCamera, Vector2, Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"

extend({ OrbitControls })

const extent = 10

// generate nice figure with lots of points
const x_period = 10
const y_period = 20
const z_period = 30
const res = 0.005

const CameraControls = () => {
    const {
        camera,
        gl: { domElement }
    } = useThree()
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef(null)
    // useFrame((state) => controls.current.update())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <orbitControls ref={controls} args={[camera, domElement]} />
}

const TestLine = React.forwardRef<Line2, any>(function Line({ points, drawLimit, color = "black", vertexColors, lineWidth, dashed, ...rest }, ref) {
    const [line2] = useState(() => new Line2())
    const [lineMaterial] = useState(() => new LineMaterial())
    const [resolution] = useState(() => new Vector2(512, 512))
    useEffect(() => {
        const geom = new LineGeometry()
        geom.setPositions(points.flat())
        line2.geometry = geom
        line2.computeLineDistances()
    }, [points, drawLimit, vertexColors, line2])

    return (
        <primitive dispose={undefined} object={line2} ref={ref} {...rest}>
            <primitive
                dispose={undefined}
                object={lineMaterial}
                attach="material"
                color={color}
                resolution={resolution}
                linewidth={lineWidth}
                {...rest}
            />
        </primitive>
    )
})

function toVector3(vals: number[]) {
    const [x, y, z] = vals
    return new Vector3(x, y, z)
}

function Thing({ points }) {
    const { size, setDefaultCamera } = useThree()
    useEffect(() => {
        // console.log(JSON.stringify(points))
        const cam = new PerspectiveCamera(70, size.width / size.height, 0.01, 10000)
        cam.position.z = 2 * extent
        cam.up.set(0, 0, 1)
        setDefaultCamera(cam)
    }, [size, setDefaultCamera])

    const p = [
        [0, 0, 0],
        [10, 10, 10],
        [0, 10, 10],
        [0, 0, 0]
    ] as [number, number, number][]

    // noinspection RequiredAttributes
    return (
        <>
            <CameraControls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <gridHelper args={[2 * extent, 20, undefined, 0xc0c0c0]} rotation={new Euler(Math.PI / 2)} />
            <axesHelper args={[extent / 10]} position={new Vector3(-extent, -extent, 0)} />
            {points.length > 1 && <TestLine points={points} linewidth={2} drawLimit={points.length} color="red" />}
        </>
    )
}

export const TestRendering = ({ segments: override = null }) => {
    function gen_points() {
        return Array.from({ length: Math.min(1000, tickRef.current) }).map((_, index) => {
            const angle = (index + tickRef.current) * res
            return [extent * Math.sin(angle * x_period), extent * Math.cos(angle * y_period), extent * Math.cos(angle * z_period)] // toVector3(point)
        })
    }

    const tickRef = useRef(0)
    const [points, setPoints] = useState(gen_points)

    useFrame(() => {
        if (!override) {
            const points = gen_points()
            // const segments = points.slice(1).flatMap((p, index) => [points[index], p])
            setPoints(points)
            tickRef.current = tickRef.current + 1
        }
    })

    return <Thing points={points} />
}
