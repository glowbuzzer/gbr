import * as React from "react"
import {
    useRef,
    useState,
    useEffect
} from "react"
import * as THREE from 'three'
import {
    Box,
    Sphere,
    PivotControls,
    Html
} from "@react-three/drei"
import {useFrame, useThree} from "@react-three/fiber"
import niceColors from "nice-color-palettes"

import {EffectComposer, Outline, SelectiveBloom, Bloom} from '@react-three/postprocessing'
import {useConnection, useFrames, useKinematicsCartesianPosition} from "@glowbuzzer/store";


export const ExampleGripper = () => {
    const baseRef = useRef(null)
    const gripperLeftRef = useRef(null)
    const gripperRightRef = useRef(null)
    const group1 = useRef(null)
    const group2 = useRef(null)

    const [grip, setGrip] = useState(false);
    const [reachedMiddle, setReachedMiddle] = useState(false);

    const tcpPosition = useKinematicsCartesianPosition(0).position.translation
    const tcpOrientation = useKinematicsCartesianPosition(0).position.rotation
    const connection = useConnection()

    console.log(connection.connected)

    const p = new THREE.Vector3(tcpPosition.x, tcpPosition.y, tcpPosition.z)
    const q = new THREE.Quaternion(tcpOrientation.x, tcpOrientation.y, tcpOrientation.z, tcpOrientation.w)

    const frames = useFrames()
    const worldPos = frames.convertToFrame(p, q, 1, "world")


    useEffect(() => {
        group1.current.position.x=worldPos.translation.x
        group1.current.position.y=worldPos.translation.y
        group1.current.position.z=worldPos.translation.z
        const orientQuat = new THREE.Quaternion(worldPos.rotation.x, worldPos.rotation.y, worldPos.rotation.z, worldPos.rotation.w)
        // const orientQuat = new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w)
        const rotEuler = new THREE.Euler().setFromQuaternion(orientQuat)
        group1.current.rotation.x=rotEuler.x
        group1.current.rotation.y=rotEuler.y
        group1.current.rotation.z=rotEuler.z
        // group1.current.update()
        console.log(group1.current)
    }, [tcpPosition, tcpOrientation])



    useFrame(({ clock }) => {


        if (!grip) {
            return
        }
        clock.getDelta()
        // gripperLeftRef.current.position.x -= Math.sin(clock.getElapsedTime()*5)*10+30
        if(!reachedMiddle) {
            gripperLeftRef.current.position.x -= 0.5
            gripperRightRef.current.position.x += 0.5
        } else{
            gripperLeftRef.current.position.x += 0.5
            gripperRightRef.current.position.x -= 0.5
        }

        console.log(gripperLeftRef.current.position.x)

        if (gripperLeftRef.current.position.x<21){
            setReachedMiddle(true)
        }
        if (gripperLeftRef.current.position.x>39 && reachedMiddle){
            gripperLeftRef.current.position.x = 40
            gripperRightRef.current.position.x = -40
            setReachedMiddle(false)
            setGrip(false)
        }
        // console.log(grip)
    })


    return(
<>
    <Html style={{
        width: "500px",
    }}
          position={[-1000,1000,0]}>
        <h1>Example 12 - adding a gripper to the robot - activate by overriding digital output #0</h1></Html>


        <group ref={group1} position={[300,300,300]}
       onClick={() => {setGrip(true)
           }}
    >
    <Box ref={baseRef} args={[100,50,100]} position={[0, 0, 50]} visible={connection.connected} castShadow={true}>
        <meshStandardMaterial color={"bisque"}/>
    </Box>
    <group ref={group2} position={[0,0,0]}>
    <Box ref={gripperLeftRef} args={[20,20,50]} position={[40, 0, 125]} visible={connection.connected} castShadow={true}>
        <meshStandardMaterial color={"silver"}/>
    </Box>
    <Box ref={gripperRightRef} args={[20,20,50]} position={[-40, 0, 125]} visible={connection.connected} castShadow={true}>
        <meshStandardMaterial color={"silver"}/>
    </Box>
    </group>
</group>
</>
    )

}