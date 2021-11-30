import * as React from "react"
import { useMemo } from "react"
import { Euler, Float32BufferAttribute, Vector3 } from "three"
// import { Line, Text } from "@react-three/drei"
import { GCodeSegment } from "@glowbuzzer/store"

function toVector3(vals: { x: number; y: number; z: number }) {
    const { x, y, z } = vals
    return new Vector3(x, y, z)
}

type DrawingExtentProps = {
    preview: GCodeSegment[]
    scale: number
}

const DashedExtent = ({ position, distanceX, distanceY, scale }) => {
    const dashSize = scale / 40

    const points = [
        position,
        position.clone().add(new Vector3(0, distanceY, 0)),
        position.clone().add(new Vector3(distanceX, distanceY, 0)),
        position.clone().add(new Vector3(distanceX, 0, 0))
    ].map(v => [v.x, v.y, v.z] as [number, number, number])

    // noinspection RequiredAttributes
    return null
    // return (
    //     <Line
    //         color="#909090"
    //         points={points}
    //         dashed={true}
    //         dashSize={dashSize}
    //         gapSize={dashSize / 2}
    //     />
    // )
}

const DrawingExtent = ({ preview, scale }: DrawingExtentProps) => {
    const OFFSET = scale / 10
    const fontSize = scale / 15

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

    const extentX = boundingBox[3] - boundingBox[0]
    const extentY = boundingBox[4] - boundingBox[1]
    const extentZ = boundingBox[5] - boundingBox[2]

    const lineHeight = 1.5

    function LabelText({ position, label, distance }) {
        // noinspection RequiredAttributes
        return null
        // return (
        //     <Text
        //         position={position}
        //         color={"#909090"}
        //         fontSize={fontSize}
        //         maxWidth={fontSize * 10}
        //         lineHeight={lineHeight}
        //         letterSpacing={0}
        //         textAlign={"left"}
        //         font="arial"
        //         anchorX="left"
        //         anchorY="top"
        //     >
        //         {label} {distance.toFixed(2)} mm
        //     </Text>
        // )
    }

    // noinspection RequiredAttributes
    return (
        <group position={new Vector3(boundingBox[0], boundingBox[2], 0)}>
            <DashedExtent
                position={new Vector3(0, -fontSize, 0)}
                distanceX={extentX}
                distanceY={-OFFSET}
                scale={scale}
            />
            <group rotation={new Euler(0, 0, -Math.PI / 2)}>
                <DashedExtent
                    position={new Vector3(-extentY, 0, 0)}
                    distanceX={extentY}
                    distanceY={-OFFSET}
                    scale={scale}
                />
            </group>
            <group
                position={new Vector3(extentX, 0, extentZ)}
                rotation={new Euler(Math.PI / 2, 0, -Math.PI / 2)}
            >
                <DashedExtent
                    position={new Vector3()}
                    distanceX={extentZ}
                    distanceY={OFFSET}
                    scale={scale}
                />
            </group>
            <LabelText
                position={new Vector3(0, -OFFSET - fontSize, 0)}
                label=" X"
                distance={extentX}
            />
            <LabelText position={new Vector3(-OFFSET, 0, 0)} label="Y" distance={extentY} />
            <group
                position={new Vector3(extentX + OFFSET, 0, fontSize * lineHeight)}
                rotation={new Euler(Math.PI / 2, 0, 0)}
            >
                <LabelText position={new Vector3()} label=" Z" distance={extentZ} />
            </group>
        </group>
    )
}

type PreviewPathProps = {
    preview: GCodeSegment[]
    highlightLine: number | undefined
    scale: number
}

export const PreviewPath = ({ preview, scale, highlightLine }: PreviewPathProps) => {
    const previewPoints = useMemo(() => {
        return preview.map(s => [toVector3(s.from), toVector3(s.to)]).flat()
    }, [preview])

    const colors = useMemo(() => {
        function get_color(segment: GCodeSegment) {
            const color = segment.lineNum === highlightLine ? [0, 0, 0] : segment.color
            return [color, color].flat()
        }

        const floats = preview.flatMap(s => get_color(s))

        return new Float32BufferAttribute(floats, 3)
    }, [preview, highlightLine])

    // noinspection RequiredAttributes
    // TODO: use memo but doesn't work with docgen
    return (
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
            <DrawingExtent preview={preview} scale={scale} />
        </>
    )
    // return useMemo(
    //     () => (
    //         <>
    //             <lineSegments>
    //                 <bufferGeometry
    //                     onUpdate={geom => {
    //                         geom.addAttribute("color", colors)
    //                         geom.setFromPoints(previewPoints)
    //                     }}
    //                 />
    //                 <lineBasicMaterial vertexColors={true} linewidth={1} />
    //             </lineSegments>
    //             <DrawingExtent preview={preview} scale={scale} />
    //         </>
    //     ),
    //     [previewPoints, colors, scale, preview]
    // )
}
