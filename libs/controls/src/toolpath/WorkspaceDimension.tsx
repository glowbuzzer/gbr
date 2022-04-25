import React from "react"
import { Text } from "@react-three/drei"
import { Euler, Vector3 } from "three"

type WorkspaceDimensionProps = {
    extent: number
}

export const WorkspaceDimensions = ({ extent }: WorkspaceDimensionProps) => {
    const fontSize = extent / 10
    const maxWidth = extent
    return (
        <>
            <Text
                position={new Vector3(-extent, -extent)}
                color={"#f0f0f0"}
                fontSize={fontSize}
                maxWidth={maxWidth}
                lineHeight={1}
                letterSpacing={0}
                textAlign={"left"}
                font="arial"
                anchorX="left"
                anchorY="top"
            >
                X {(extent * 2).toFixed(2)} mm
            </Text>
            <Text
                position={new Vector3(-extent, -extent)}
                rotation={new Euler(0, 0, Math.PI / 2)}
                color={"#f0f0f0"}
                fontSize={fontSize}
                maxWidth={maxWidth}
                lineHeight={1}
                letterSpacing={0}
                textAlign={"left"}
                font="arial"
                anchorX="left"
                anchorY="bottom"
            >
                Y {(extent * 2).toFixed(2)} mm
            </Text>
        </>
    )
}
