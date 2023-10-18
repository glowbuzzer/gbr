/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { RcFile } from "antd/es/upload"
import { Button, Slider, Space, Switch, Tag, Upload } from "antd"
import { useState } from "react"
import { Euler, Matrix3, Matrix4, Vector3 } from "three"
import { useUrdfContext } from "./UrdfContextProvider"
import * as math from "mathjs"
import { map } from "mathjs"

function fwd(vectors: number[][], values: number[]) {
    // Create rotation matrix from eigenvectors
    const rot = math.matrix(vectors)

    // Create diagonal inertia tensor in the principal axis frame
    const diag = math.diag(values)

    // Compute inertia tensor in the original frame: I = R * I' * R^T
    const tmp = math.multiply(rot, diag)
    const orig = math.multiply(tmp, math.transpose(rot))

    // Extract components ixx, ixy, ixz, iyy, iyz, izz from the original inertia tensor
    //     const [[ixx, ixy, ixz], [_, iyy, iyz], [__, ___, izz]] = originalInertia.toArray();

    console.log(orig)
}

fwd(
    [
        [0.9996324434183997, 2.6812827964051225e-2, 4.006285303095918e-3],
        [2.6897549551752897e-2, -0.9993770336414858, -2.2848773666340513e-2],
        [-3.3911492846243475e-3, -2.2948134706656433e-2, 0.9997309054040564]
    ].reverse(),
    [0.10033169846781069, 9.842420647294188e-2, 7.264109505924751e-2].reverse()
)

function i_to_matrix3(matrix: number[][], index = 0) {
    console.log("inertiaTensor", matrix.toString())

    const { vectors, values } = math.eigs(matrix)

    const normalizedVectors = vectors.map((vector: any) => math.divide(vector, math.norm(vector)))

    // fwd(normalizedVectors as number[][], values as number[])

    const rotationMatrix = math.transpose(normalizedVectors as math.Matrix)

    // Form the rotation matrix
    const array = math.flatten(rotationMatrix) as unknown as number[]
    // console.log("array from j", index, array)
    // const m3 = new Matrix3().fromArray([0.0, 0.02, 1.0, 0.02, 1.0, -0.02, -1.0, 0.02, 0.0])
    const m3 = new Matrix3().fromArray(array)
    // console.log("m3", m3.toArray(), m3.clone().transpose().toArray())
    const m4 = new Matrix4().setFromMatrix3(m3)
    const euler = new Euler().setFromRotationMatrix(m4)

    console.log("vectors for j", index, vectors, euler.toArray())

    return { values, euler }
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

        const inertiaTensor = [
            [ixx, ixy, ixz],
            [ixy, iyy, iyz],
            [ixz, iyz, izz]
        ]
        const { values, euler } = i_to_matrix3(inertiaTensor, index)

        const { position: centreOfMass } = get_origin(inertial)
        return {
            position,
            rotation,
            centreOfMass,
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
    const {
        frames,
        setFrames,
        opacity,
        setOpacity,
        showFrames,
        showCentresOfMass,
        showAxesOfInertia,
        setShowFrames,
        setShowCentresOfMass,
        setShowAxesOfInertia
    } = useUrdfContext()

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

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <Space>
                    <Upload beforeUpload={before_upload} showUploadList={false}>
                        <Button size="small">Load URDF File</Button>
                    </Upload>
                    {urdfDoc && <Tag color="green">URDF Loaded</Tag>}
                </Space>

                <div>
                    <div>Model Opacity</div>
                    <Slider min={0} max={1} step={0.05} value={opacity} onChange={setOpacity} />
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
                                checked={showAxesOfInertia}
                                onChange={setShowAxesOfInertia}
                            />{" "}
                            Show Axes of Inertia
                        </div>
                    </>
                )}
                <Button size="small" onClick={recalc}>
                    CALC
                </Button>
            </Space>
        </div>
    )
}
