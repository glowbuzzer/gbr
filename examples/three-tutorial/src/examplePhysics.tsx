import * as React from "react"
import {
    useRef,
    useEffect,
    useMemo
} from "react"
import * as THREE from 'three'
import {
    Plane,
    Sphere,
    Html
} from "@react-three/drei"
import {useFrames, useKinematicsCartesianPosition} from "@glowbuzzer/store"
import {Physics, useBox, useSphere, usePlane, Debug} from "@react-three/cannon"
import niceColors from "nice-color-palettes"

export const ExamplePhysics = () => {

    const position = useKinematicsCartesianPosition(0).position.translation
    const orientation = useKinematicsCartesianPosition(0).position.rotation
    const p = new THREE.Vector3(position.x, position.y, position.z)
    const q = new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w)

    const frames = useFrames()
    const worldPos = frames.convertToFrame(p, q, 1, "world")

    // console.log("worldPos.translation", worldPos.translation)

    return (
        <Physics gravity={[0, 0, -9.81]}>
            {/*<Debug color="black" scale={1.1}>*/}
            <PhysicsPlane/>
            {/*<BrickWall num={16}/>*/}
            <Dominos/>
            <PhysicsTool newPosition={worldPos.translation} size={[50,64,64]}/>
            {/*</Debug>*/}
            </Physics>

    )
}

function PhysicsPlane(props) {
    const [ref] = usePlane(() => ({...props}), useRef<THREE.Mesh>(null))

    return (
        <mesh ref={ref}>
            <Plane ref={ref} args={[2000, 2000]} visible={false}>
                <meshPhysicalMaterial color="white" transparent={true}/>
            </Plane>
        </mesh>
    )
}

const getArcVals = (i) => {
    const ang = map(i, 0, 9, -Math.PI/2, Math.PI/2);
    const x = 300 * Math.cos(ang) + 600;
    const y = 300 * Math.sin(ang);
    return { position: [x,  y, 101], rotation: [0, 0, ang] };
};


// to translate value from one range to another (linear)
const map = (value, sMin, sMax, dMin, dMax) => {
    return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
};

const range = (n, m = 0) =>
    Array(n)
        .fill(m)
        .map((i, j) => i + j);

const getDominos = () => {
    const dominos = []

    range(10).forEach((i) => {
        dominos.push({
            ...getArcVals(i)
        })
    })

    range(15).forEach((i) => {
        dominos.push({
            position: [map(i, 0, 15, -800, 600), -300, 101],
            rotation: [0, 0, Math.PI / 2]
        })
    })
        range(5).forEach((i) => {
        dominos.push({
            position: [map(i, 0, 5, 100, 600), 300, 101],
            rotation: [0,0,Math.PI/2]
        })
    })

    return dominos;
}


const Dominos = () => {

    const dominos = getDominos();
    const number = dominos.length;

    const colorTemp = new THREE.Color()

    const colorData = Array.from({ length: number }, () => ({ color: niceColors[17][Math.floor(Math.random() * 5)], scale: 1 }))

    const colorArray = useMemo(() => Float32Array.from(new Array(number).fill(number).flatMap((_, i) => colorTemp.set(colorData[i].color).toArray())), [])

    const [ref, api] = useBox((index) => ({
        mass: 10,
        args: [100, 10, 200],
        // linearDamping: 0.56,
        // angularDamping: 0.56,
        // type: "Static"
        // type: "Kinematic"
        ...dominos[index],
    }), useRef<THREE.InstancedMesh>(null),)


    return(
        <instancedMesh receiveShadow={true} castShadow={true} ref={ref} args={[null, null, number]}>
            <boxGeometry attach="geometry" args={[100, 10, 200]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </boxGeometry>
            <meshStandardMaterial attach="material" toneMapped={false} vertexColors={true}/>
        </instancedMesh>
    )
}

function BrickWall({num}) {
    const tempColor = new THREE.Color()
    const data = Array.from({ length: num }, () => ({ color: niceColors[17][Math.floor(Math.random() * 5)], scale: 1 }))
    const colorArray = useMemo(() => Float32Array.from(new Array(num).fill(num).flatMap((_, i) => tempColor.set(data[i].color).toArray())), [])

    const positions: {x:number, y:number, z:number}[]=[]

    // console.log("num", num)

    const wallDims: number = Math.sqrt(num)
    const wallCorner: number[] = [500, -165, 50]

    const brickSpacing: number = 110

    for (let i = 0; i < wallDims; i++) {
        for (let j = 0; j < wallDims; j++) {

            const tempPos: {x:number, y:number, z:number}= {x:wallCorner[0] , y:wallCorner[1]+ j * brickSpacing, z:wallCorner[2] + i * brickSpacing}

            positions.push(tempPos)
        }
    }



    console.log(positions)
    // console.log(colorArray)

    const [ref, api] = useBox((index) => ({
        mass: 10000,
        args: [100, 100, 100],
        // linearDamping: 0.56,
        // angularDamping: 0.56,
        // type: "Static"
        // type: "Kinematic"
        position: [positions[index].x,positions[index].y, positions[index].z]
    }), useRef<THREE.InstancedMesh>(null),)


    useEffect(() => {
        //     // Set positions

        for (let i = 0; i < num; i++) {
            // console.log(positions[i].x)
            // console.log(positions[i].y)
            // console.log(positions[i].z)
            // pi.at(i).position.set(positions[i].x, positions[i].y, positions[i].z)
            // api.at(i).velocity.set(0,0,0)
            // api.at(i).angularVelocity.set(0,0,0)
        }
    }, [])

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         for (let i = 0; i < num; i++) {
    //             api.at(i).velocity.set(0, 0, 0)
    //             api.at(i).angularVelocity.set(0, 0, 0)
    //         }
    //     }, 1000)
    // })

    return (
        <instancedMesh receiveShadow={true} castShadow={true} ref={ref} args={[null, null, num]}>
            <boxGeometry attach="geometry" args={[100, 100, 100]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
                {/*<instancedBufferAttribute needsUpdate={true} attach="attributes-position" args={[positions,3]}/>*/}
            </boxGeometry>
            <meshStandardMaterial attach="material" toneMapped={false} vertexColors={true}/>
        </instancedMesh>


    )
}

const PhysicsTool = (props) => {

    const [toolRef, toolPhysicsApi] = useSphere(() => ({
        args: props.size,
        type: "static",
        mass: 1000,
        ...props
    }))

    // const pos = useRef(new THREE.Vector3(0, 0, 0));
    // useEffect(
    //     () =>
    //         toolPhysicsApi.position.subscribe((v) => {
    //             console.log(pos)
    //             return (pos.current = new THREE.Vector3(v[0], v[1], v[2]));
    //         }),
    //     [toolPhysicsApi, ref]
    // );


    useEffect(() => {
        toolPhysicsApi.position.set(props.newPosition.x, props.newPosition.y, props.newPosition.z)
        console.log("effect", props.newPosition.x)
    }, [props]);

    return (
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 4 - physics engine - use the robot to knock down the dominos</h1></Html>

            <Sphere ref={toolRef} args={props.size}>
            <meshStandardMaterial color="blue" visible={false}/>
        </Sphere>
            </>
    )
}
