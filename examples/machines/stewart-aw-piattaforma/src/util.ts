/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { useMemo } from "react"
import { DoubleSide, Euler, MeshPhysicalMaterial, Quaternion, Vector3 } from "three"
import { base_coordinates, base_offset_z, platform_coordinates, platform_offset_z } from "./config"

export const transparent_material = new MeshPhysicalMaterial({
    color: 0x999999,
    envMapIntensity: 1,
    metalness: 0.5,
    roughness: 0.5,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide
})

/**
 * Calculate the rotation required to orientate the upper part of the UJ connecting the platform to the rod.
 * Note that this is purely for visualisation of the UJ, and is not needed for the inverse kinematics calculation done by GBC.
 *
 * See these links for inspiration:
 * https://math.stackexchange.com/a/4093224/648283, and
 * https://github.com/andywiecko/RotateVectorToLieOnPlane/blob/main/Assets/TestScript.cs
 *
 * @param platform_rotation // the current rotation of the platform in the kc frame
 * @param uj_platform_lower_rotation // the rotation of the lower part of the UJ connecting the platform to the rod
 */
function uj_platform_upper_rotation(
    platform_rotation: Quaternion,
    uj_platform_lower_rotation: Quaternion
): number {
    const v = new Vector3(1, 0, 0).applyQuaternion(platform_rotation) // vector we want to align with plane
    const r = new Vector3(0, 0, 1).applyQuaternion(platform_rotation) // axis of rotation
    const n = new Vector3(0, 1, 0).applyQuaternion(uj_platform_lower_rotation) // normal to the plane to align with (XZ plane of the UJ lower joint)

    const A = v.dot(n)
    const B = r.clone().cross(v).dot(n)
    const C = v.dot(r) * n.dot(r)

    const tmp1 = C - A
    const tmp2 = B * B
    const tmp3 = tmp1 * tmp1 + tmp2
    const delta = Math.sqrt(tmp2 * (tmp3 - C * C))

    const x = (C * tmp1 + delta) / tmp3
    const y = (tmp1 * x) / B - C / B

    return Math.atan2(y, x)
}

export const useStewartPlatformInverseKinematics = () => {
    const {
        position: { translation, rotation }
    } = useKinematicsCartesianPosition(0)

    return useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => {
            // calculate the position of the platform connection point in the kc local frame and relative to the corresponding base point
            const rod_end_point = platform_coordinates[i]
                .clone()
                .sub(new Vector3(0, 0, platform_offset_z))
                .applyQuaternion(rotation)
                .sub(new Vector3(0, 0, base_offset_z))
                .add(translation)
                .sub(base_coordinates[i])

            // we want to know the swivel and tilt angles of the rod
            const swivel = Math.atan2(rod_end_point.y, rod_end_point.x) + Math.PI / 2
            const l = Math.sqrt(rod_end_point.x ** 2 + rod_end_point.y ** 2)
            const tilt = Math.atan2(l, rod_end_point.z)
            const combined = new Quaternion().setFromEuler(new Euler(tilt, 0, swivel, "ZYX"))
            const uj_platform_upper_twist = uj_platform_upper_rotation(rotation, combined)

            return {
                rod_twist: new Quaternion().setFromEuler(
                    new Euler(0, 0, (Math.PI / 8) * (i % 2 === 0 ? 1 : -1)) // sign flip on rod twist
                ),
                swivel: new Quaternion().setFromEuler(new Euler(0, 0, swivel)),
                tilt: new Quaternion().setFromEuler(new Euler(tilt, 0, 0)),
                swivel_tilt_inverse: combined.clone().invert(),
                uj_platform_upper_twist: new Quaternion().setFromEuler(
                    new Euler(0, 0, uj_platform_upper_twist)
                )
            }
        })
    }, [translation, rotation])
}
