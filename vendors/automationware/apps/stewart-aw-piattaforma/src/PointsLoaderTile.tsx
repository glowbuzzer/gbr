/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
// @ts-ignore
import { ReactComponent as FileOpenIcon } from "@material-symbols/svg-400/outlined/folder_open.svg"
import { Button, message, Space, Upload } from "antd"
import { Simulate } from "react-dom/test-utils"
import { RcFile } from "antd/es/upload"
import { Euler, Quaternion } from "three"
import {
    BLENDTYPE,
    LIMITPROFILE,
    useConfigLoader,
    usePointsList,
    useStream
} from "@glowbuzzer/store"
import { degToRad } from "three/src/math/MathUtils"

export const PointsLoaderTile = () => {
    const points = usePointsList()
    const loader = useConfigLoader()
    const stream = useStream(0)

    function before_upload(info: RcFile) {
        info.arrayBuffer()
            .then(buffer => {
                const text = new TextDecoder("utf-8").decode(buffer)
                const points = text
                    .split("\n")
                    .filter(l => l.length)
                    .map((line, i) => {
                        const [x, y, z, a, b, c] = line.split(",").map(parseFloat)
                        const valid_rotation = !isNaN(a) && !isNaN(b) && !isNaN(c)
                        const quat = new Quaternion().setFromEuler(
                            new Euler(degToRad(a), degToRad(b), degToRad(c))
                        )
                        const rotation = valid_rotation
                            ? { x: quat.x, y: quat.y, z: quat.z, w: quat.w }
                            : undefined

                        return {
                            name: "Point " + i,
                            translation: {
                                x,
                                y,
                                z
                            },
                            rotation
                        }
                    })
                return loader({
                    points
                })
            })
            .then(() => message.success("Points loaded"))
        return false
    }

    function run() {
        return stream.send(api =>
            points.map(p =>
                api
                    .moveLine()
                    .setFromPoint(p)
                    .params({
                        // limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_JOGGING,
                        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
                        vmaxPercentage: 100,
                        amaxPercentage: 100,
                        jmaxPercentage: 100
                    })
                    .promise()
            )
        )
    }

    function clear() {
        return loader({
            points: []
        })
    }

    return (
        <div>
            {/*
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <Upload beforeUpload={before_upload} maxCount={1} showUploadList={false}>
                        <GlowbuzzerIcon
                            useFill={true}
                            Icon={FileOpenIcon}
                            button
                            title="Load Config from File"
                        />
                    </Upload>
                </DockToolbarButtonGroup>
            </DockToolbar>
*/}
            <div style={{ padding: "10px" }}>
                <Space direction="vertical">
                    <Space align="baseline">
                        <Upload beforeUpload={before_upload} maxCount={1} showUploadList={false}>
                            <Button size="small">Load Points</Button>
                        </Upload>
                        <Button size="small" onClick={clear}>
                            Clear
                        </Button>
                    </Space>
                    <Space align="baseline">
                        <Button size="small" onClick={run}>
                            Execute Moves
                        </Button>
                    </Space>
                </Space>
            </div>
        </div>
    )
}
