import { RobotModel } from "./robots"
import * as THREE from "three"

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import * as React from "react"
import { useEffect, useState } from "react"

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.0/")
loader.setDRACOLoader(dracoLoader)

const arrowVectors = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
]
const arrowColors = [0xff0000, 0x00ff00, 0x0000ff]

function add_triad(group: THREE.Group) {
    const arrows = [0, 1, 2].map(
        i =>
            new THREE.ArrowHelper(
                arrowVectors[i],
                undefined,
                0.25,
                arrowColors[i],
                undefined,
                0.025
            )
    )
    group.add(...arrows)
}

function add_next(group: THREE.Group, config, triad) {
    if (triad) {
        add_triad(group)
    }
    const mount = new THREE.Group()
    group.add(mount)

    if (config) {
        const { offset: translateZ, alpha: rotateX, link_length: translateX } = config
        mount.translateZ(translateZ || 0)
        mount.rotateX(rotateX || 0)
        mount.translateX(translateX || 0)
    }

    // group.add(mount);
    return mount
}

type TcpRobotProps = {
    model: RobotModel
    joints: number[]
}

export const TcpRobot = ({ model, joints }: TcpRobotProps) => {
    const [robotModels, setRobotModels] = useState<THREE.Group[]>([])

    useEffect(() => {
        const actual_links = model.config.filter(c => c.limits)

        const files = Array.from({ length: actual_links.length + 1 }).map(
            (_, index) => `/assets/${model.name}/L${index}.glb`
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
                return [...model.config, {}].map((c, index) => {
                    if (c && !c.skip_link) {
                        const model = models[model_index++].scene
                        current.add(model)
                    }
                    const next = add_next(
                        current,
                        model.config[index - 1],
                        index === model.config.length
                    )
                    // current.rotation.z = joints[model_index]
                    const last = current
                    current = next
                    return last
                })
            })
            .then(models => {
                models[0].scale.setScalar(model.scale)
                models[0].translateX(model.offset.x)
                models[0].translateY(model.offset.y)
                models[0].translateZ(model.offset.z)
                setRobotModels(models)
            })
            .catch(console.log)
    }, [model])

    useEffect(() => {
        function adjustForTeta(index: number, a: number) {
            return a + (model.config[index].teta || 0) // take into account the dreaded tetas!
        }

        if (robotModels?.length) {
            joints.forEach((value, index) => {
                if (robotModels[index]) {
                    const theta = value || 0
                    robotModels[index + 1].rotation.z = adjustForTeta(index, theta)
                }
            })
        }
    }, [robotModels, joints, model.config])

    return robotModels.length ? <primitive object={robotModels[0]} /> : null
}
