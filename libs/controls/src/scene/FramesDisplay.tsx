/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useRef, useState } from "react"
import {
    Frame,
    useFrames,
    useKinematicsExtents,
    usePrefs,
    useSelectedFrame
} from "@glowbuzzer/store"
import { TriadHelper } from "./TriadHelper"
import { Euler, MeshBasicMaterial, Quaternion, Vector3 } from "three"
import { Html, Sphere } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"
import { ReactComponent as TranslationIcon } from "../icons/translation.svg"
import { ReactComponent as RotationIcon } from "../icons/rotation.svg"

import styled from "styled-components"

const StyledDiv = styled.div`
    margin-top: 10px;
    padding: 5px;
    user-select: none;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);

    .title {
        font-weight: bold;
        padding-bottom: 3px;
    }

    .grid {
        display: grid;
        gap: 5px;
        grid-template-columns: 25px repeat(4, fit-content(100px));

        > div {
            text-align: right;
        }

        .units {
            text-align: left;
        }
    }
`

const mat_semi_transparent = new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.2
})

const mat_solid_black = new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.7
})

type HoveredFrame = {
    frameIndex: number
    point: Vector3
}

const FramePopover = ({ frame, point }: { frame: Frame; point: Vector3 }) => {
    const { translation, rotation } = frame.relative
    const { getUnits, fromSI } = usePrefs()

    const euler = new Euler().setFromQuaternion(
        new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    )
    const [x, y, z] = translation.toArray().map(v => fromSI(v, "linear"))
    const [rx, ry, rz] = euler.toArray().map(v => fromSI(v, "angular"))

    return (
        <Html position={point}>
            <StyledDiv>
                <div className="title">{frame.text}</div>

                <div className="grid">
                    <TranslationIcon height={20} />
                    <div>{x.toFixed(2)}</div>
                    <div>{y.toFixed(2)}</div>
                    <div>{z.toFixed(2)}</div>
                    <div className="units">{getUnits("linear")}</div>

                    <RotationIcon height={20} />
                    <div>{rx.toFixed(2)}</div>
                    <div>{ry.toFixed(2)}</div>
                    <div>{rz.toFixed(2)}</div>
                    <div className="units">{getUnits("angular")}</div>
                </div>
            </StyledDiv>
        </Html>
    )
}

export const FramesDisplay = () => {
    const { asList: frames } = useFrames()
    const [selectedFrame, setSelectedFrame] = useSelectedFrame()
    const [hoveredFrame, setHoveredFrame] = useState<HoveredFrame>(null)
    const { max } = useKinematicsExtents()
    const debounceTimer = useRef(null)

    function on_mouse_enter(e: ThreeEvent<PointerEvent>, frameIndex: number) {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }
        setHoveredFrame({
            frameIndex,
            point: e.point
        })
    }

    function on_mouse_leave() {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }
        debounceTimer.current = setTimeout(() => {
            setHoveredFrame(null)
        }, 250)
    }

    return (
        <>
            {frames.map((f, i) => {
                const { translation, rotation } = f.absolute
                const { x, y, z } = translation
                const { x: qx, y: qy, z: qz, w } = rotation
                const q = new Quaternion(qx, qy, qz, w)

                const sphere_size = max / 200
                return (
                    <group key={i}>
                        <group
                            position={[x, y, z]}
                            quaternion={q}
                            onPointerOver={e => on_mouse_enter(e, i)}
                            onPointerOut={on_mouse_leave}
                            onClick={() => setSelectedFrame(i)}
                        >
                            <TriadHelper size={max / 10} opacity={i === selectedFrame ? 1 : 0.3} />
                            <Sphere
                                args={[sphere_size, sphere_size, sphere_size]}
                                position={[0, 0, 0]}
                                material={
                                    i === selectedFrame ? mat_solid_black : mat_semi_transparent
                                }
                            />
                        </group>
                        {hoveredFrame?.frameIndex === i && (
                            <FramePopover frame={frames[i]} point={hoveredFrame.point} />
                        )}
                    </group>
                )
            })}
        </>
    )
}
