/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// @ts-ignore
import { ReactComponent } from "./estop.svg"
import { useEstop } from "@glowbuzzer/store"

export const EStopButton = ({ size }) => {
    const active = useEstop()

    return (
        <ReactComponent
            width={size}
            height={size}
            viewBox="0 0 614.2879 614.2879"
            opacity={active ? 1 : 0.2}
        />
    )
}
