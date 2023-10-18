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
    console.log("doc", doc)
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
    console.log("links", ...links)
    console.log("joints", ...joints)

    function get(j: ChildNode, name: string): HTMLElement {
        return Array.from(j.childNodes).find(node => node.nodeName === name) as HTMLElement
    }

    function get_origin(j: ChildNode) {
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
        return { position, rotation }
    }

    return joints.map((j, index) => {
        const { position, rotation } = get_origin(j)

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
            [ixx, ixy, -ixz],
            [-ixy, iyy, -iyz],
            [-ixz, -iyz, izz]
        ]
        const { vectors, values, euler } = decompose(inertiaTensor, index)

        const { position: centreOfMass } = get_origin(inertial)
        return {
            name: "Link " + (index + 1),
            position,
            rotation,
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
        showFrames,
        showCentresOfMass,
        showPrincipleAxesOfInertia,
        showInertiaCuboid,
        modelOpacity
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

    // const frames = load_urdf(urdfDoc)
    // console.log(frames)

    function recalc() {
        setFrames(load_urdf(urdfDoc))
    }

    function setModelOpacity(modelOpacity: number) {
        updateOptions({ modelOpacity })
    }

    function setShowFrames(showFrames: boolean) {
        updateOptions({ showFrames })
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

    return (
        <StyledDiv>
            <Space direction="vertical">
                <Space>
                    <Upload beforeUpload={before_upload} showUploadList={false}>
                        <Button size="small">Load URDF File</Button>
                    </Upload>
                    {urdfDoc && <Tag color="green">URDF Loaded</Tag>}
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

                {frames.length > 0 && (
                    <>
                        <div>
                            <Switch size="small" checked={showFrames} onChange={setShowFrames} />{" "}
                            Show Frames
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showCentresOfMass}
                                onChange={setShowCentresOfMass}
                            />{" "}
                            Show Centres of Mass
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showPrincipleAxesOfInertia}
                                onChange={setShowPrincipleAxesOfInertia}
                            />{" "}
                            Show Axes of Inertia
                        </div>
                        <div>
                            <Switch
                                size="small"
                                checked={showInertiaCuboid}
                                onChange={setShowInertiaCuboid}
                            />{" "}
                            Show Inertia Cuboid
                        </div>
                    </>
                )}
                <Button size="small" onClick={recalc}>
                    RECALC
                </Button>
                {/*
                <Table
                    pagination={false}
                    size="small"
                    columns={[
                        {
                            title: "Frame",
                            dataIndex: "name",
                            key: "name"
                        }
                    ]}
                    dataSource={frames}
                />
*/}
            </Space>
            <Tabs>
                {frames.map((frame, index) => (
                    <Tabs.TabPane tab={frame.name} key={index}>
                        <div className="grid">
                            {frame.eigenVectors.flat().map((v, i) => (
                                <div key={i}>{v.toFixed(2)}</div>
                            ))}
                        </div>
                        <div className="grid col1">
                            {frame.principleMoments.map((v, i) => (
                                <div key={i}>{(v * 1e6).toFixed(2)}</div>
                            ))}
                        </div>
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </StyledDiv>
    )
}
