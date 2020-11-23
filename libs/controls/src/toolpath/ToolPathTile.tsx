import * as React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button } from "antd"
import { usePreview, useToolPath } from "@glowbuzzer/store"
import { PreviewPath, ToolPath, ToolPathAutoSize } from "./ToolPathFiber"
import { Canvas } from "react-three-fiber"
import { Euler, Vector3 } from "three"

export const ToolPathTile = () => {
    const { path, reset } = useToolPath(0)
    const { segments } = usePreview()

    const extent = 20

    return (
        <Tile title={"Toolpath"} footer={<Button onClick={reset}>Reset</Button>}>
            <Canvas>
                <ToolPathAutoSize extent={extent}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <gridHelper args={[2 * extent, 20, undefined, 0xc0c0c0]} rotation={new Euler(Math.PI / 2)} />
                    <axesHelper args={[30]} position={new Vector3(-180, -20, 0)} />
                    <ToolPath path={path} />
                    <PreviewPath preview={segments} />
                </ToolPathAutoSize>
            </Canvas>

            {/*
            <ToolPathDisplay width={1000} height={800} extent={200} path={path} segments={segments} />
*/}
        </Tile>
    )
}
