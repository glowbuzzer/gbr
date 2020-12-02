import React from "react"
import { Text } from "@react-three/drei"
import { Euler, Vector3 } from "three"

type WorkspaceDimensionProps = {
    xExtent: number[]
    yExtent: number[]
    zExtent: number[]
}

export const WorkspaceDimensions = (props: WorkspaceDimensionProps) => {
    const { xExtent, yExtent, zExtent } = props
    const xDim = xExtent[1] - xExtent[0]
    const yDim = yExtent[1] - yExtent[0]
    const zDim = zExtent[1] - zExtent[0]

    // noinspection RequiredAttributes
    return (
        <>
            <Text
                position={new Vector3(xExtent[0], yExtent[0])}
                color={"#f0f0f0"}
                fontSize={10}
                maxWidth={100}
                lineHeight={1}
                letterSpacing={0}
                textAlign={"left"}
                font="arial"
                anchorX="left"
                anchorY="top"
            >
                X {xDim.toFixed(2)} mm
            </Text>
            <Text
                position={new Vector3(xExtent[0], yExtent[0])}
                rotation={new Euler(0, 0, Math.PI / 2)}
                color={"#f0f0f0"}
                fontSize={10}
                maxWidth={100}
                lineHeight={1}
                letterSpacing={0}
                textAlign={"left"}
                font="arial"
                anchorX="left"
                anchorY="bottom"
            >
                Y {xDim.toFixed(2)} mm
            </Text>
        </>
    )
}
