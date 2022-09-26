/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { RobotModel } from "./robots"
import * as THREE from "three"

import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib"
import * as React from "react"
import { useEffect, useState } from "react"
import { ToolConfig } from "@glowbuzzer/store"
import { triadArrowColors, triadArrowVectors } from "./TriadHelper"

const loader = new GLTFLoader()
loader.setPath(new URL("./assets", window.location.href).href)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.0/")
loader.setDRACOLoader(dracoLoader)

function add_triad(group: THREE.Group) {
    const arrows = [0, 1, 2].map(
        i =>
            new THREE.ArrowHelper(
                triadArrowVectors[i],
                undefined,
                0.25,
                triadArrowColors[i],
                undefined,
                0.025
            )
    )
    group.add(...arrows)
}

function add_next(name: string, group: THREE.Group, config, triad) {
    if (triad) {
        add_triad(group)
    }
    const mount = new THREE.Group()
    group.name = name
    group.add(mount)

    const { offset: translateZ, alpha: rotateX, link_length: translateX } = config || {}
    mount.translateZ(translateZ || 0)
    mount.rotateX(rotateX || 0)
    mount.translateX(translateX || 0)

    return mount
}

type TcpRobotProps = {
    model: RobotModel
    joints: number[]
    toolConfig: ToolConfig
}

/** @ignore - internal to the tool path tile */
export const TcpRobot = ({ model, joints, toolConfig }: TcpRobotProps) => {
    const [robotModels, setRobotModels] = useState<THREE.Group[]>([])

    useEffect(() => {
        const actual_links = model.config.filter(c => c.limits)

        const files = Array.from({ length: actual_links.length + 1 }).map(
            (_, index) => `/${model.name}/L${index}.glb`
        )

        Promise.all(
            files.map(
                src =>
                    new Promise((resolve, reject) => loader.load(src, resolve, undefined, reject))
            )
        )
            .then((models: GLTF[]) => {
                let current = new THREE.Group()
                let model_index = 0
                const links = [...model.config, {}].map((c, index) => {
                    if (c && !c.skip_link) {
                        const model = models[model_index++].scene
                        current.add(model)
                    }
                    const next = add_next(
                        `L${index}${c.skip_link ? " (skip)" : ""}`,
                        current,
                        model.config[index - 1],
                        false
                    )
                    // current.rotation.z = joints[model_index]
                    const last = current
                    current = next
                    return last
                })

                const x = (toolConfig.translation.x || 0) / model.scale
                const y = (toolConfig.translation.y || 0) / model.scale
                const z = (toolConfig.translation.z || 0) / model.scale

                const toolDiameter = toolConfig.diameter / model.scale / 2 || 0

                const geometry = new THREE.CylinderGeometry(toolDiameter, toolDiameter, z)
                const material = new THREE.MeshBasicMaterial({ color: 0x303030 })

                const cone = new THREE.Mesh(geometry, material)
                cone.translateZ(-z / 2)
                cone.rotateX(Math.PI / 2)

                const cone_group = new THREE.Group()
                cone_group.add(cone)
                cone_group.translateX(x)
                cone_group.translateY(y)
                cone_group.translateZ(z)

                add_triad(cone_group)
                current.add(cone_group)
                return links
            })
            .then(models => {
                models[0].scale.setScalar(model.scale)
                models[0].translateX(model.offset.x)
                models[0].translateY(model.offset.y)
                models[0].translateZ(model.offset.z)
                setRobotModels(models)
            })
            .catch(console.log)
    }, [model, toolConfig])

    useEffect(() => {
        function adjustForTeta(a: number, index: number) {
            return a + (model.config[index]?.teta || 0) // take into account the dreaded tetas!
        }

        if (robotModels?.length) {
            // create a mapping from model index to joint index
            const map1 = [...model.config, {}].slice(1).map((c, index) => ({ c, index: index + 1 }))
            const filtered = map1.filter(({ c }) => !c.skip_link)
            const entries = filtered.map(({ c, index }, jointNum) => [index - 1, jointNum])

            const map = Object.fromEntries(entries)
            // console.log(
            //     "CONFIG",
            //     model.config.map((c, index) => `${index}: ${c.skip_link}`)
            // )
            // console.log("MAP", entries)

            robotModels.slice(1).forEach((group, index) => {
                const jointNum = map[index]
                const jointPos = joints[jointNum] || 0
                group.rotation.z = adjustForTeta(jointPos, index)
            })
        }
    }, [robotModels, joints, model.config])

    return robotModels.length ? <primitive object={robotModels[0]} /> : null
}
