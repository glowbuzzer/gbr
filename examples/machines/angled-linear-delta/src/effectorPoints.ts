import * as THREE from "three"
import React from "react"

/**
 * This builds an array of Vector3s containg the co-ordinates of the points of attachment for the rods to the effector
 * in an Igus Delta robot. In some ways this is specific to the IGUS DLE-DR series of delta robots but other delta robots
 * have similar arrangements
 * @param shaftLength
 * @param innerCircleRadius
 * @constructor
 */
export function EffectorPoints(shaftLength: number, innerCircleRadius: number): THREE.Vector3[] {
    const outerCircleRadius = Math.sqrt(Math.pow(42, 2) + Math.pow(shaftLength, 2))
    const largeAngle = Math.atan2(shaftLength, innerCircleRadius)
    const smallAngle = (120 * Math.PI) / 180 - 2 * largeAngle

    const angles = []

    angles.push(smallAngle / 2)
    angles.push(angles[0] + largeAngle * 2)
    angles.push(angles[1] + smallAngle)
    angles.push(angles[2] + largeAngle * 2)
    angles.push(angles[3] + smallAngle)
    angles.push(angles[4] + largeAngle * 2)

    console.log(
        "angles",
        angles.map(x => (x * 180) / Math.PI)
    )

    const points: THREE.Vector3[] = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    ]

    //formula for circle coordinates  r*cos(theta)

    //Math.PI/6 =  30 degree adjustment to rotation just because of how we set up the angle list

    points.map((vec, index) => {
        vec.x = outerCircleRadius * Math.cos(angles[index] - Math.PI / 6)
        vec.y = outerCircleRadius * Math.sin(angles[index] - Math.PI / 6)
        vec.z = 0
    })

    console.log("points", points)

    return points
}
