/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    BufferAttribute,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Mesh,
    MeshPhongMaterial,
    Object3D
} from "three"

let promise = null

export function initializeStepLoader() {
    if (promise) {
        console.warn("Multiple calls to initializeStepLoader. Ignoring")
        return
    }

    const occtLib = import("occt-import-js")
    promise = occtLib
        .then(occt => {
            return occt.default()
        })
        .catch(err => {
            console.error("Error loading occt-import-js", err)
            promise = null
        })
}

export function loadStepFile(url: string): Promise<Object3D> {
    if (!promise) {
        throw new Error("Step loading is not initialized. Please call initializeStepLoader()")
    }

    return promise.then(async (occt: any) => {
        const response = await fetch(url)
        const buffer = await response.arrayBuffer()
        const fileBuffer = new Uint8Array(buffer)

        const result = occt.ReadStepFile(fileBuffer, null)

        const targetObject = new Object3D()

        // process the geometries of the result
        for (const resultMesh of result.meshes) {
            const geometry = new BufferGeometry()

            geometry.setAttribute(
                "position",
                new Float32BufferAttribute(resultMesh.attributes.position.array, 3)
            )
            if (resultMesh.attributes.normal) {
                geometry.setAttribute(
                    "normal",
                    new Float32BufferAttribute(resultMesh.attributes.normal.array, 3)
                )
            }
            const index = Uint16Array.from(resultMesh.index.array)
            geometry.setIndex(new BufferAttribute(index, 1))

            let material = null
            if (resultMesh.color) {
                const color = new Color(
                    resultMesh.color[0],
                    resultMesh.color[1],
                    resultMesh.color[2]
                )
                material = new MeshPhongMaterial({ color: color })
            } else {
                material = new MeshPhongMaterial({ color: 0xcccccc })
            }

            const mesh = new Mesh(geometry, material)
            targetObject.add(mesh)
        }
        return targetObject
    })
}
