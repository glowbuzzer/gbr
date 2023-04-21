import * as React from "react"
import { useRef, forwardRef, useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { Box, Plane, useHelper, Instances, Instance, Sphere, Html } from "@react-three/drei"
import { useThree, useFrame, extend } from "@react-three/fiber"
import * as ThreeMeshUI from "three-mesh-ui"
import { useFrames, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import niceColors from "nice-color-palettes"

extend(ThreeMeshUI)

type UiPanelProps = {
    position?: number[]
    rotation?: number[]
    scale?: number
    visible?: boolean
}

const UiPanel = ({
    position = [200, 200, 200],
    rotation = [0, 0, 0],
    scale = 100,
    visible = true
}: UiPanelProps) => {
    // const button1Block = useRef<ThreeMeshUI.Block>(null)
    // const button2Block = useRef<ThreeMeshUI.Block>(null)
    // const buttonGroupBlock = useRef<ThreeMeshUI.Block>(null)
    // const titleBlock = useRef<ThreeMeshUI.Block>(null)
    // const overallBlock = useRef<ThreeMeshUI.Block>(null)
    // const titleText = useRef<ThreeMeshUI.Text>(null)
    // const button1Text = useRef<ThreeMeshUI.Text>(null)
    // const button2Text = useRef<ThreeMeshUI.Text>(null)

    const button1Block = useRef(null)
    const button2Block = useRef(null)
    const buttonGroupBlock = useRef(null)
    const titleBlock = useRef(null)
    const overallBlock = useRef(null)
    const titleText = useRef(null)
    const button1Text = useRef(null)
    const button2Text = useRef(null)

    const buttonOptions = {
        width: 0.5,
        height: 0.15,
        justifyContent: "center",
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075,
        fontSize: 0.07,
        fontFamily: "/fonts/Roboto-msdf.json",
        fontTexture: "/fonts/Roboto-msdf.png"
    }

    const hoveredStateAttributes = {
        state: "hovered",
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x999999),
            backgroundOpacity: 1,
            fontColor: new THREE.Color(0xffffff),
            fontSize: 0.06
        }
    }

    const idleStateAttributes = {
        state: "idle",
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x666666),
            backgroundOpacity: 0.3,
            fontColor: new THREE.Color(0xffffff),
            fontSize: 0.06
        }
    }

    const selectedAttributes = {
        offset: 0.02,
        backgroundColor: new THREE.Color(0x777777),
        fontColor: new THREE.Color(0x222222)
    }

    useEffect(() => {
        button1Block.current.setupState({
            state: "selected",
            attributes: selectedAttributes,
            onSet: () => {
                console.log("click1")
            }
        })

        button1Block.current.setupState(hoveredStateAttributes)
        button1Block.current.setupState(idleStateAttributes)

        button2Block.current.setupState({
            state: "selected",
            attributes: selectedAttributes,
            onSet: () => {
                console.log("click2")
            }
        })

        button2Block.current.setupState(hoveredStateAttributes)
        button2Block.current.setupState(idleStateAttributes)

        button1Block.current.setState("idle")
        button2Block.current.setState("idle")

        overallBlock.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
        buttonGroupBlock.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
        button1Text.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })

        titleBlock.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
        titleText.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })

        button1Block.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
        button2Text.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
        button2Block.current.set({
            fontFamily: "/fonts/Roboto-msdf.json",
            fontTexture: "/fonts/Roboto-msdf.png"
        })
    })

    useFrame(state => {
        overallBlock.current.position.set(
            position[0] + Math.sin(state.clock.getElapsedTime()) * 10,
            position[1] + Math.cos(state.clock.getElapsedTime()) * 10,
            position[2]
        )
        overallBlock.current.rotation.set(rotation[0], rotation[1], rotation[2])
        overallBlock.current.scale.set(scale, scale, scale)
    })

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <block
            ref={overallBlock}
            args={[
                {
                    fontSize: 0.07,
                    padding: 0.12,
                    contentDirection: "column-reverse",
                    // fontFamily: "/fonts/Roboto-msdf.json",
                    // fontTexture: "/fonts/Roboto-msdf.png",
                    width: 2,
                    height: 0.7,
                    borderRadius: 0.11,
                    backgroundColor: new THREE.Color("lightgrey"),
                    fontColor: new THREE.Color("black")
                    // opacity: 0.4
                }
            ]}
        >
            <block
                ref={buttonGroupBlock}
                args={[
                    {
                        justifyContent: "center",
                        contentDirection: "row-reverse",
                        fontSize: 0.07,
                        padding: 0.02,
                        width: 1.4,
                        height: 0.2,
                        borderRadius: 0.11
                    }
                ]}
            >
                <block
                    ref={button2Block}
                    onPointerEnter={() => button2Block.current.setState("hovered")}
                    onPointerLeave={() => button2Block.current.setState("idle")}
                    onPointerDown={() => button2Block.current.setState("selected")}
                    onPointerUp={() => {
                        button2Block.current.setState("hovered")
                    }}
                    args={[buttonOptions]}
                >
                    {/* prettier-ignore */
                            /* @ts-ignore  */}
                    <text ref={button2Text} content={'Digital Output 2'} args={[{fontSize: 0.06}]}/>
                </block>
                <block
                    ref={button1Block}
                    onPointerEnter={() => button1Block.current.setState("hovered")}
                    onPointerLeave={() => button1Block.current.setState("idle")}
                    onPointerDown={() => button1Block.current.setState("selected")}
                    onPointerUp={() => {
                        button1Block.current.setState("hovered")
                    }}
                    args={[buttonOptions]}
                >
                    {/* prettier-ignore */
                            /* @ts-ignore  */}
                    <text ref={button1Text} content={'Digital Output 1'} args={[{fontSize: 0.06}]}/>
                </block>
            </block>

            <block
                ref={titleBlock}
                args={[
                    {
                        fontSize: 0.07,
                        padding: 0.12,
                        justifyContent: "start",
                        borderRadius: 0.11,
                        width: 1.5,
                        height: 0.3,
                        backgroundOpacity: 0,
                        fontColor: new THREE.Color("black")
                    }
                ]}
            >
                {/* prettier-ignore */
                        /* @ts-ignore  */}
                <text ref={titleText} content={'Use the buttons to set digital outputs. Open the Digital Outputs Tile to see the results'}
                        args={[{fontSize: 0.06}]}/>
            </block>
        </block>
    )
}

export const ExampleUI = () => {
    useFrame(() => {
        ThreeMeshUI.update()
    })

    return (
        <>
            <Html
                style={{
                    width: "500px"
                }}
                position={[-1000, 1000, 0]}
            >
                <h1>Example 10 - creating a UI on the canvas</h1>
            </Html>

            <UiPanel position={[200, 300, 400]} scale={200} />
        </>
    )
}
