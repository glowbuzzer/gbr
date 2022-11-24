/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useLayoutEffect, useMemo } from "react"
import { Euler, Float32BufferAttribute, Vector3 } from "three"
import { GCodeSegment } from "@glowbuzzer/store"
import { Line, Text } from "@react-three/drei"
import { useScale } from "./ScaleProvider"

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

    return (
        // @ts-ignore
        <Line
            color="#909090"
            points={points}
            dashed={true}
            dashSize={dashSize}
            gapSize={dashSize / 2}
        />
    )
}

const LabelText = ({ position, label, distance, fontSize, lineHeight }) => (
    // @ts-ignore
    <Text
        position={position}
        color={"#909090"}
        fontSize={fontSize}
        maxWidth={fontSize * 10}
        lineHeight={lineHeight}
        letterSpacing={0}
        textAlign={"left"}
        anchorX="left"
        anchorY="top"
    >
        {label} {distance.toFixed(2)} mm
    </Text>
)

const DrawingExtent = ({ preview, scale }: DrawingExtentProps) => {
    const OFFSET = scale / 10
    const fontSize = scale / 15

    // calculate lower and upper limits of all points
    const { minPoint, maxPoint } = useMemo(() => {
        const minPoint = new Vector3(1e99, 1e99, 1e99)
        const maxPoint = new Vector3(-1e99, -1e99, -1e99)

        for (const point of preview) {
            minPoint.x = Math.min(minPoint.x, point.from.x, point.to.x)
            minPoint.y = Math.min(minPoint.y, point.from.y, point.to.y)
            minPoint.z = Math.min(minPoint.z, point.from.z, point.to.z)
            maxPoint.x = Math.max(maxPoint.x, point.from.x, point.to.x)
            maxPoint.y = Math.max(maxPoint.y, point.from.y, point.to.y)
            maxPoint.z = Math.max(maxPoint.z, point.from.z, point.to.z)
        }

        return {
            minPoint,
            maxPoint
        }
    }, [preview])

    const extentX = maxPoint.x - minPoint.x
    const extentY = maxPoint.y - minPoint.y
    const extentZ = maxPoint.z - minPoint.z

    const lineHeight = 1.5

    if (!preview.length) {
        return null
    }
    return (
        <group position={new Vector3(minPoint.x, minPoint.y, 0)}>
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
                fontSize={fontSize}
                lineHeight={lineHeight}
            />
            <LabelText
                position={new Vector3(-OFFSET, 0, 0)}
                label="Y"
                distance={extentY}
                fontSize={fontSize}
                lineHeight={lineHeight}
            />
            <group
                position={new Vector3(extentX + OFFSET, 0, fontSize * lineHeight)}
                rotation={new Euler(Math.PI / 2, 0, 0)}
            >
                <LabelText
                    position={new Vector3()}
                    label=" Z"
                    distance={extentZ}
                    fontSize={fontSize}
                    lineHeight={lineHeight}
                />
            </group>
        </group>
    )
}

type PreviewPathProps = {
    preview: GCodeSegment[]
    highlightLine: number | undefined
}

/** @ignore - internal to the tool path tile */
export const PreviewPath = ({ preview, highlightLine }: PreviewPathProps) => {
    const { extent: scale } = useScale()
    const ref = React.useRef</*BufferGeometry*/ any>(null)

    useLayoutEffect(() => {
        function get_color(segment: GCodeSegment) {
            const color = segment.lineNum === highlightLine ? [0, 0, 0] : segment.color
            return [color, color].flat()
        }

        const previewPoints = preview.map(s => [toVector3(s.from), toVector3(s.to)]).flat()
        const colors = preview.flatMap(s => get_color(s))
        const colors_array = new Float32BufferAttribute(colors, 3)

        if (ref.current) {
            ref.current.setFromPoints(previewPoints)
            ref.current.setAttribute("color", colors_array)
        }
    }, [preview, highlightLine])

    return (
        <>
            <lineSegments>
                <bufferGeometry ref={ref} />
                <lineBasicMaterial vertexColors={true} linewidth={1} />
            </lineSegments>
            <DrawingExtent preview={preview} scale={scale} />
        </>
    )
}
