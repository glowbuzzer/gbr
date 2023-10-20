/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { RcFile } from "antd/es/upload"
import { Button, Slider, Space, Switch, Tabs, Tag, Upload } from "antd"
import { useState } from "react"
import { Euler, Matrix3, Matrix4, Vector3 } from "three"
import { useUrdfContext } from "./UrdfContextProvider"
import * as math from "mathjs"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding: 10px;

    .grid {
        display: inline-grid;
        grid-template-columns: repeat(3, auto);
        padding: 1px;
        grid-gap: 1px;
        text-align: right;
        background: ${props => props.theme.colorBorder};

        div {
            background: ${props => props.theme.colorBgBase};
            padding: 2px 8px;
        }
    }

    .grid.col1 {
        grid-template-columns: repeat(1, auto);
    }
`

function decompose(matrix: number[][], index = 0) {
    const { vectors, values } = math.eigs(matrix)

    const normalizedVectors = vectors.map((vector: any) => math.divide(vector, math.norm(vector)))

    const rotationMatrix = math.transpose(normalizedVectors as math.Matrix)

    // Form the rotation matrix
    const array = math.flatten(rotationMatrix) as unknown as number[]
    const m3 = new Matrix3().fromArray(array)
    const m4 = new Matrix4().setFromMatrix3(m3)
    const euler = new Euler().setFromRotationMatrix(m4)

    return {
        vectors: vectors as unknown as number[][],
        values,
        euler
    }
}

function load_urdf(doc: Document) {
    if (!doc) {
        return []
    }
    // filter element children
    const links = Array.from(doc.documentElement.childNodes)
        .filter(node => node.nodeName === "link")
        .slice(1)

    const joints = Array.from(doc.documentElement.childNodes).filter(
        node => node.nodeName === "joint"
    )

    if (links.length !== 6) {
        throw new Error("Wrong number of links - expected 6")
    }
    if (joints.length !== 6) {
        throw new Error("Wrong number of joints - expected 6")
    }

    function get(j: ChildNode, name: string): HTMLElement {
        return Array.from(j.childNodes).find(node => node.nodeName === name) as HTMLElement
    }

    function get_origin(j: ChildNode, withAxis = false) {
        const origin = get(j, "origin")
        if (!origin) {
            throw new Error("No origin found")
        }
        const [x, y, z] = origin.attributes.getNamedItem("xyz").value.split(" ").map(parseFloat)
        const [roll, pitch, yaw] = origin.attributes
            .getNamedItem("rpy")
            .value.split(" ")
            .map(parseFloat)
        const position = new Vector3(x, y, z)
        const rotation = new Euler(roll, pitch, yaw, "ZYX")

        const axis = get(j, "axis")?.attributes.getNamedItem("xyz").value.split(" ").map(parseFloat)
        if (withAxis && !axis) {
            throw new Error("No axis found for joint")
        }

        return { position, rotation, axis: withAxis ? new Vector3(...axis) : undefined }
    }

    return joints.map((j, index) => {
        const { position, rotation, axis } = get_origin(j, true)

        const inertial = get(links[index], "inertial")

        const inertia = get(inertial, "inertia")
        const [ixx, ixy, ixz, iyy, iyz, izz] = ["ixx", "ixy", "ixz", "iyy", "iyz", "izz"]
            .map(name => inertia.attributes.getNamedItem(name).value)
            .map(parseFloat)

        // console.log(
        //     "joint",
        //     index,
        //     `ixx -> ${ixx}, ixy -> ${ixy}, ixz -> ${ixz}, iyy -> ${iyy}, iyz -> ${iyz}, izz -> ${izz}`
        // )
        const inertiaTensor = [
            [ixx, ixy, ixz],
            [ixy, iyy, iyz],
            [ixz, iyz, izz]
        ]
        const { vectors, values, euler } = decompose(inertiaTensor, index)

        const { position: centreOfMass } = get_origin(inertial)

        return {
            name: "Link " + (index + 1),
            position,
            rotation,
            axis,
            centreOfMass,
            eigenVectors: vectors,
            principleAxes: euler,
            principleMoments: values as number[],
            ixx,
            ixy,
            ixz,
            iyy,
            iyz,
            izz
        }
    })
}

export const UrdfTile = () => {
    const [urdfDoc, setUrdfDoc] = useState(null)
    const { frames, options, setFrames, updateOptions } = useUrdfContext()

    const {
        showFramesURDF,
        showWorldPositionURDF,
        showCentresOfMass,
        showPrincipleAxesOfInertia,
        showInertiaCuboid,
        modelOpacity,
        showWorldPositionDH,
        showFramesDH
    } = options

    async function before_upload(info: RcFile) {
        // function called when user selects a file to "upload" (actually just load into memory)
        const text = new TextDecoder().decode(await info.arrayBuffer())

        // parse the XML to JSON object
        const parser = new DOMParser()
        const urdf = parser.parseFromString(text, "text/xml")

        setFrames(load_urdf(urdf))
        setUrdfDoc(urdf)

        return false
    }

    function recalc() {
        const frames = load_urdf(urdfDoc)
        console.log("result", frames)
        setFrames(frames)
    }

    function setModelOpacity(modelOpacity: number) {
        updateOptions({ modelOpacity })
    }

    function setShowFrames(showFramesURDF: boolean) {
        updateOptions({ showFramesURDF })
    }

    function setShowWorldPositionURDF(showWorldPositionURDF: boolean) {
        updateOptions({ showWorldPositionURDF })
    }

    function setShowCentresOfMass(showCentresOfMass: boolean) {
        updateOptions({ showCentresOfMass })
    }

    function setShowPrincipleAxesOfInertia(showPrincipleAxesOfInertia: boolean) {
        updateOptions({ showPrincipleAxesOfInertia })
    }

    function setShowInertiaCuboid(showInertiaCuboid: boolean) {
        updateOptions({ showInertiaCuboid })
    }

    function setShowFramesDH(showFramesDH: boolean) {
        updateOptions({ showFramesDH })
    }

    function setShowWorldPositionDH(showWorldPositionDH: boolean) {
        updateOptions({ showWorldPositionDH })
    }

    const loaded = frames.length > 0

    return (
        <StyledDiv>
            <Space direction="vertical">
                <Space>
                    <Upload beforeUpload={before_upload} showUploadList={false}>
                        <Button size="small">Upload URDF File</Button>
                    </Upload>
                    {loaded && <Tag color="green">URDF Loaded</Tag>}
                </Space>

                <div>
                    <div>Model Opacity</div>
                    <Slider
                        min={0}
                        max={1}
                        step={0.05}
                        value={modelOpacity}
                        onChange={setModelOpacity}
                    />
                </div>

                <div>Options</div>

                {loaded && (
                    <>
                        <div>
                            <Switch
                                size="small"
                                checked={showFramesURDF}
                                onChange={setShowFrames}
                            />{" "}
                            URDF Frames
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showWorldPositionURDF}
                                onChange={setShowWorldPositionURDF}
                            />{" "}
                            URDF World Position
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showCentresOfMass}
                                onChange={setShowCentresOfMass}
                            />{" "}
                            Centres of Mass
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showPrincipleAxesOfInertia}
                                onChange={setShowPrincipleAxesOfInertia}
                            />{" "}
                            Axes of Inertia
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showInertiaCuboid}
                                onChange={setShowInertiaCuboid}
                            />{" "}
                            Inertia Cuboids
                        </div>
                    </>
                )}
                <div>
                    <Switch size="small" checked={showFramesDH} onChange={setShowFramesDH} /> DH
                    Frames
                </div>
                <div>
                    <Switch
                        size="small"
                        checked={showWorldPositionDH}
                        onChange={setShowWorldPositionDH}
                    />{" "}
                    DH World Position
                </div>
                {/*
                <Button size="small" onClick={recalc}>
                    RECALC
                </Button>
*/}
                {loaded ? (
                    <Tabs>
                        {frames.map((frame, index) => (
                            <Tabs.TabPane tab={frame.name} key={index}>
                                <div className="grid">
                                    {frame.eigenVectors.flat().map((v, i) => (
                                        <div key={i}>{v.toFixed(3)}</div>
                                    ))}
                                </div>
                                <div className="grid col1">
                                    {frame.principleMoments.map((v, i) => (
                                        <div key={i}>{(v * 1e6).toFixed(3)}</div>
                                    ))}
                                </div>
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                ) : (
                    <p>Load URDF file for more options</p>
                )}
            </Space>
        </StyledDiv>
    )
}
