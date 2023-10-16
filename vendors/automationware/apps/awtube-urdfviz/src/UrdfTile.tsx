/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { RcFile } from "antd/es/upload"
import { Button, Slider, Space, Switch, Tag, Upload } from "antd"
import { useState } from "react"
import { Euler, Vector3 } from "three"
import { useUrdfContext } from "./UrdfContextProvider"

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
        const { position: centreOfMass } = get_origin(get(links[index], "inertial"))
        return { position, rotation, centreOfMass }
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
        setShowFrames,
        setShowCentresOfMass
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
                    </>
                )}
            </Space>
        </div>
    )
}
