/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { Button } from "antd"
import { useSoloActivity } from "@glowbuzzer/store"

export const TestMotionTile = () => {
    const [complete, setComplete] = useState(false)
    const soloActivity = useSoloActivity(0)

    async function do_promise() {
        setComplete(false)
        await soloActivity.moveLine(10, 0, 0).promise()
        await soloActivity.moveLine(10, 10, 0).promise()
        await soloActivity.moveLine(0, 10, 0).promise()
        await soloActivity.moveLine(0, 0, 0).promise()
        setComplete(true)
    }

    return (
        <div style={{ padding: "10px" }}>
            <Button onClick={do_promise}>DO MOVE</Button>
            {complete ? "OPERATION COMPLETE" : ""}
        </div>
    )
}
