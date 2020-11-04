import * as React from "react"
import { useRef } from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button } from "antd"
import { ToolPathDisplay } from "./ToolPathDisplay"
import { useKinematics, useToolPath } from "@glowbuzzer/store"

export const ToolPathTile = () => {
    const { path, reset } = useToolPath(0)
    const kinematics = useKinematics(0, 0)

    const count = useRef(0)
    count.current++

    return (
        <Tile title={"Toolpath"} footer={<Button onClick={reset}>Reset</Button>}>
            {<ToolPathDisplay width={1000} height={800} extent={200} path={path} />}
        </Tile>
    )
}
