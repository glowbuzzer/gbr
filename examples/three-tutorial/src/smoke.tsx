import * as React from "react"
import {
    useRef,
    forwardRef,
    useEffect,
    useMemo,
    useState,
    useImperativeHandle
} from "react"
import * as THREE from 'three'
import {
    Box,
    Plane,
    useHelper,
    Instances,
    Instance,
    Sphere,
    Html,
    Billboard,
    useTexture,
} from "@react-three/drei"
import {
    useThree,
    useFrame,
    extend,
} from "@react-three/fiber"



const CLOUD_IMAGE = '/png/cloud.png'

type SmokeProps = {
    opacity?: number
    speed?: number
    width?: number
    depth?: number
    segments?: number
    texture?: string
    color?: any
    depthTest?: boolean
    props:any
}

const defaultSmokeProps = {
    texture: '/png/cloud.png'
}

// export const Smoke = ({
//     opacity = 0.5,
//     speed = 0.4,
//     width = 10,
//     depth = 1.5,
//     segments = 20,
//     texture = CLOUD_IMAGE,
//     color = '#ffffff',
//     depthTest = true,
//     ...props
// }:SmokeProps)=>{

export const Smoke = forwardRef((props:SmokeProps, ref)=>{

    props = { ...defaultSmokeProps, ...props }

    const innerRef = useRef(null)
    useImperativeHandle(ref, () => innerRef.current)


    console.log(props)
// export const Smoke() = {
//                    opacity = 0.5,
//                    speed = 0.4,
//                    width = 10,
//                    depth = 1.5,
//                    segments = 20,
//                    texture = CLOUD_IMAGE,
//                    color = '#ffffff',
//                    depthTest = true,
//                    ...props
//                }) {
    const gl = useThree((state) => state.gl)
    const group = React.useRef<THREE.Group>()
    const cloudTexture = useTexture(props.texture) as THREE.Texture
    const clouds = React.useMemo(
        () =>
            [...new Array(props.segments)].map((_, index) => ({
                x: props.width / 2 - Math.random() * props.width,
                y: props.width / 2 - Math.random() * props.width,
                scale: 0.4 + Math.sin(((index + 1) / props.segments) * Math.PI) * ((0.2 + Math.random()) * 10),
                density: Math.max(0.2, Math.random()),
                rotation: Math.max(0.002, 0.005 * Math.random()) * props.speed,
            })),
        [props.width, props.segments, props.speed]
    )
    useFrame((state) =>
        group.current?.children.forEach((cloud, index) => {
            cloud.children[0].rotation.z += clouds[index].rotation
            cloud.children[0].scale.setScalar(
                clouds[index].scale + (((1 + Math.sin(state.clock.getElapsedTime() / 10)) / 2) * index) / 10
            )
        })
    )
    return (
        <group ref={innerRef} {...props}>
            <group position={[0, 0, (props.segments / 2) * props.depth]} ref={group}>
                {clouds.map(({ x, y, scale, density }, index) => (
                    <Billboard key={index} position={[x, y, -index * props.depth]}>
                        <Plane scale={scale} rotation={[0, 0, 0]}>
                            <meshStandardMaterial
                                map={cloudTexture}
                                map-encoding={gl.outputEncoding}
                                transparent={true}
                                opacity={(scale / 6) * density * props.opacity}
                                depthTest={props.depthTest}
                                color={props.color}
                            />
                        </Plane>
                    </Billboard>
                ))}
            </group>
        </group>
    )
})