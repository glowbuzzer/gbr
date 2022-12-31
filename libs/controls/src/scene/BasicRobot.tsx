/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { RobotKinematicsChainElement } from "./robots"
import * as THREE from "three"
import { Group } from "three"
import * as React from "react"
import { FunctionComponent, useEffect, useMemo, useRef } from "react"
import { Quat, Vector3 } from "@glowbuzzer/store"

export type BasicRobotElement = {
    group: Group
    config: RobotKinematicsChainElement
}

export type BasicRobotProps = {
    /** The forward kinematics chain of the robot */
    kinematicsChain: RobotKinematicsChainElement[]
    /** The current joint positions */
    jointPositions: number[]
    /** The THREE models that make up the robot */
    parts: Group[]
    /** The position of the robot */
    translation?: Vector3
    /** The orientation of the robot */
    rotation?: Quat
    /** Scale to be applied to the robot parts */
    scale?: number
    /** Any React nodes to be added at the end of the robot kinematics chain to represent the current tool */
    children?: React.ReactNode
}

/**
 * The BasicRobot component renders a robot with a kinematics chain and applies the joint positions.
 *
 * Any children are rendered as children of the robot and will appear in the same coordinate system at the tool centre
 * point of the robot. This can be used to add a tool component such as a {@link CylindricalTool}, a {@link TriadHelper} or a
 * custom tool such as a gripper.
 *
 */
export const BasicRobot = ({
    kinematicsChain,
    parts,
    jointPositions,
    translation = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0, w: 1 },
    scale = 1,
    children = null
}: BasicRobotProps) => {
    const elements = useMemo(() => {
        const chain: (RobotKinematicsChainElement & { base?: boolean })[] = [
            { base: true, moveable: false }, // force the first element to include the base
            ...kinematicsChain
        ]

        // console.log("chain", chain)

        let link_index = 0
        const elements = chain.map((element, index) => {
            const group = new THREE.Group()
            group.name = `G${index}`
            if (element.base || element.moveable) {
                group.name += `L${link_index}`
                // parts[index].name = `L${link_index}`
                const link = parts[link_index++]
                link.traverse(function (child) {
                    child.castShadow = true
                })
                group.add(link)
                // console.log("group", group)
            }
            const { translateX, translateY, translateZ, rotateX, rotateY, rotateZ } = element

            group.rotation.set(rotateX || 0, rotateY || 0, rotateZ || 0)
            group.position.set(translateX || 0, translateY || 0, translateZ || 0)

            return {
                group,
                config: element
            } as BasicRobotElement
        })

        // console.log("elements", elements)

        const base = elements[0].group
        base.position.set(translation.x, translation.y, translation.z)
        base.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
        base.scale.setScalar(scale)

        const last = elements[elements.length - 1].group
        last.scale.setScalar(1 / scale)

        return elements
    }, [kinematicsChain, parts, scale]) //why on earth is this firing so much?

    useEffect(() => {
        elements
            .filter(e => e.config.moveable)
            .forEach((e, index) => {
                // console.log(e)
                e.group.rotation.z =
                    (jointPositions[index] || 0) + (e.config.jointAngleAdjustment || 0)
            })
    }, [elements, jointPositions])

    return (
        elements
            .slice()
            .reverse()
            .reduce((child, parent, index) => {
                return (
                    <primitive key={index} object={parent.group}>
                        {child}
                    </primitive>
                )
            }, <>{children}</>) || (
            /**
             * This is only here to keep react-docgen happy, it will never be rendered
             */ <></>
        )
    )
}
