/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TransformControls } from "@react-three/drei"
import { Camera, Matrix4, Quaternion, Vector3 } from "three"
import { useEffect, useRef, useState } from "react"

type PointEditControlProps = {
    value: Vector3
    onChange: (value: Vector3) => void
}

export const PointEditControl = ({ value: valueProp, onChange }: PointEditControlProps) => {
    const ref = useRef<any>(null)
    // we want to avoid updating matrix when the value is updated from within the control, so keep a copy
    const [value, setValue] = useState<Vector3>(valueProp)

    useEffect(() => {
        if (valueProp && valueProp !== value) {
            setValue(valueProp)
        }
    }, [valueProp])

    useEffect(() => {
        ref.current.matrix = new Matrix4().compose(value, new Quaternion(), new Vector3(1, 1, 1))
        ref.current.matrixWorldNeedsUpdate = true
    }, [value])

    function update_position(e) {
        const position = e.target.worldPosition as Vector3
        // transform controls sends a zero vector when it's first rendered, which we need to ignore
        if (!position.equals(new Vector3())) {
            setValue(position)
            onChange(position)
        }
    }

    return <TransformControls position={value} ref={ref} onChange={update_position} />
}
