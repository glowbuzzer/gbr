import React, { useEffect, useState } from "react"
import { Vector2 } from "three"
import { Line2, LineGeometry, LineMaterial } from "three-stdlib"

type DynamicLineProps = {
    points: number[] // must be flat pairs of points
    color: string
    lineWidth: number
}

export const DynamicLine = React.forwardRef<Line2, DynamicLineProps>(function Line(
    { points, color = "black", lineWidth, ...rest },
    ref
) {
    const [line2] = useState(() => new Line2())
    const [lineMaterial] = useState(() => new LineMaterial())
    const [resolution] = useState(() => new Vector2(512, 512))
    useEffect(() => {
        const geom = new LineGeometry()
        geom.setPositions(points)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        line2.geometry = geom
        line2.computeLineDistances()
    }, [points, line2])

    return (
        <primitive dispose={undefined} object={line2} ref={ref} {...rest}>
            <primitive
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
