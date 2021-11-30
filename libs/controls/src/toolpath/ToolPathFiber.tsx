import * as React from "react"
import { extend } from "react-three-fiber"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DoubleSide, Euler, Vector3 } from "three"
import simplify from "./simplify"
// import { DynamicLine } from "./DynamicLine"

// TODO: hack alert - cannot export from lib project??
// declare type GCodeSegment = any

// extend({ OrbitControls })

export const ToolPath = ({ path, scale }) => {
    const pathPoints = simplify(path, 0.01).flatMap(p => [p.x, p.y, p.z])
    const lastPoint: Vector3 = path[path.length - 1]

    const fulcrumHeight = 0.4 * scale
    const fulcrum = new Vector3(
        lastPoint?.x || 0,
        lastPoint?.y || 0,
        (lastPoint?.z || 0) + fulcrumHeight / 2
    )

    // noinspection RequiredAttributes
    return (
        <>
            {/*
            <DynamicLine
                points={pathPoints} // Array of points
                color={"red"}
                lineWidth={2} // In pixels (default)
            />
*/}
            <mesh position={fulcrum} rotation={new Euler(-Math.PI / 2, 0, 0)}>
                <coneBufferGeometry args={[0.05 * scale, fulcrumHeight, 3]} />
                <meshPhongMaterial
                    color="#000099"
                    opacity={0.1}
                    transparent={true}
                    side={DoubleSide}
                    flatShading={true}
                />
            </mesh>
        </>
    )
}
