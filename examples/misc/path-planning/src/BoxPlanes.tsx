/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Box3, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three"
import { faces } from "./planning"

export function BoxPlanes({ box3, colors: colors }: { box3: Box3; colors: string[] }) {
    const planes = faces(box3)

    // Scale factor for displaying planes
    return (
        <>
            {planes.map((face, i) => {
                const {
                    plane,
                    size: [x, y],
                    offset: [ox, oy, oz]
                } = face
                // Convert the plane to a mesh for visualization
                const geometry = new PlaneGeometry(x, y)
                const mesh = new Mesh(
                    geometry,
                    new MeshBasicMaterial({ color: colors[i], side: DoubleSide })
                )

                // Position and rotate the mesh to match the plane
                mesh.lookAt(plane.normal)
                mesh.position.copy(plane.coplanarPoint(new Vector3()))

                return <primitive key={i} position={[ox, oy, oz]} object={mesh} />
            })}
        </>
    )
}
