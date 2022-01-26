import * as React from "react"
import { useEffect, useState } from "react"
import * as THREE from "three"
import { DoubleSide, Euler, Vector3 } from "three"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

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

export const ToolPath = ({ path, scale, model, joints }) => {
    const [robotModels, setRobotModels] = useState<THREE.Group[]>([])
    const pathPoints = simplify(path, 0.01).flatMap(p => [p.x, p.y, p.z])
    const lastPoint: Vector3 = path[path.length - 1]

    const fulcrumHeight = 0.4 * scale
    const fulcrum = new Vector3(
        lastPoint?.x || 0,
        lastPoint?.y || 0,
        (lastPoint?.z || 0) + fulcrumHeight / 2
    )

    useEffect(() => {
        if (model) {
            console.log("LOAD MODEL", model.name)
            const actual_links = model.config.filter(c => c.limits)

            const files = Array.from({ length: actual_links.length + 1 }).map(
                (_, index) => `/assets/${model.name}/L${index}.glb`
            )

            Promise.all(
                files.map(
                    src =>
                        new Promise((resolve, reject) =>
                            loader.load(src, resolve, undefined, reject)
                        )
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
        }
    }, [model])

    useEffect(() => {
        function adjustForTeta(index: number, a: number) {
            return a + (model.config[index].teta || 0) // take into account the dreaded tetas!
        }

        if (robotModels?.length) {
            joints.forEach((value, index) => {
                if (robotModels[index]) {
                    const theta = value || 0
                    const angle = adjustForTeta(index, theta)
                    // console.log("SET JOINT ANGLE", index, "RADS", theta, "ADJUSTED", angle)
                    robotModels[index + 1].rotation.z = angle
                }
            })
        }
    }, [robotModels, joints, model.config])

    // noinspection RequiredAttributes
    return (
        <>
            <DynamicLine
                points={pathPoints} // Array of points
                color={"red"}
                lineWidth={2} // In pixels (default)
            />

            {robotModels.length ? (
                <primitive object={robotModels[0]} />
            ) : (
                <mesh position={fulcrum} rotation={new Euler(-Math.PI / 2, 0, 0)}>
                    <coneBufferGeometry args={[0.05 * scale, fulcrumHeight, 3]} />
                    <meshPhongMaterial
                        color="#000099"
                        opacity={0.1}
                        transparent={true}
                        side={DoubleSide}
                        flatShading={true}
                    />
                </mesh>
            )}
        </>
    )
}
