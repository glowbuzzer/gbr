import { Tile } from "@glowbuzzer/controls"
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
        <Tile title="Test Motion">
            <Button onClick={do_promise}>DO MOVE</Button>
            {complete ? "OPERATION COMPLETE" : ""}
        </Tile>
    )
}
