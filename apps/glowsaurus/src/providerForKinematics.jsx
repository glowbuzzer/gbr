import * as React from "react"
import { kinematicsContext } from "@glowbuzzer/hooks"
import { Quaternion, Vector3 } from "three"

let slerp_current = 0
let slerp_increment = 0.05

let xyz_angle = 0
const xyz_increment = 0.05

export const Provider = props => {
    const [vals, setVals] = React.useState({
        position: new Vector3(0, 0, 0),
        orientation: new Quaternion(0, 0, 0, 1)
    })

    function increment() {
        const position = new Vector3(Math.sin(xyz_angle) * 100, Math.cos(xyz_angle) * 100, 0)
        const orientation = new Quaternion(1, 0, 0, 0).slerp(
            new Quaternion(0, 1, 0, 0),
            slerp_current
        )

        xyz_angle += xyz_increment
        slerp_current += slerp_increment

        if (slerp_current > 1) {
            slerp_current = 1
            slerp_increment *= -1
        } else if (slerp_current < 0) {
            slerp_current = 0
            slerp_increment *= -1
        }

        return {
            position,
            orientation
        }
    }

    // setTimeout(() => {
    //     setVals(increment());
    // }, 100);

    return (
        <kinematicsContext.Provider
            value={{ pose: vals, frameIndex: 1, type: 0, currentConfiguration: 0b101 }}
        >
            {props.children}
        </kinematicsContext.Provider>
    )
}
