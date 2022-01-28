import * as React from "react"
import { DoubleSide, Euler, Vector3 } from "three"

type TcpFulcrumProps = {
    scale: number
    position: Vector3
}

export const TcpFulcrum = ({ scale, position }: TcpFulcrumProps) => {
    const fulcrumHeight = 0.4 * scale

    const adjusted_position = position.clone().add(new Vector3(0, 0, fulcrumHeight / 2))

    return (
        <mesh position={adjusted_position} rotation={new Euler(-Math.PI / 2, 0, 0)}>
            <coneBufferGeometry args={[0.05 * scale, fulcrumHeight, 3]} />
            <meshPhongMaterial
                color="#000099"
                opacity={0.1}
                transparent={true}
                side={DoubleSide}
                flatShading={true}
            />
        </mesh>
    )
}
