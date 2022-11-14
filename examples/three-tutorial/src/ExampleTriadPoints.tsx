import * as React from "react"
import {
    useRef,
    Fragment,
    useState, useEffect
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    Html,
    Text,
    Instance,
    Instances,
    useGLTF,
    Point,
    Points,
    PointMaterial,
    Segments,
    Segment,
    useTexture
} from "@react-three/drei"
import {useFrame, useLoader} from "@react-three/fiber"
import {useConfig, useKinematicsCartesianPosition} from "@glowbuzzer/store"

import {Card} from 'antd'


// const triadArrowVectors = [
//     new THREE.Vector3(1, 0, 0),
//     new THREE.Vector3(0, 1, 0),
//     new THREE.Vector3(0, 0, 1)
// ]
//
const triadArrowColors = [0xff0000, 0x00ff00, 0x0000ff]
//
// const TriadPointHelper = ({ size }) => {
//     return (
//         <>
//
//             {triadArrowVectors.map((v, i) => (
//                 <arrowHelper
//                     key={i + ":" + size}
//                     args={[v, undefined, size, triadArrowColors[i], undefined, size / 10]}
//                 />
//             ))}
//
//         </>
//     )
// }




export function PartModel(props) {
    const { nodes, materials} = useGLTF('/models/part.glb')

const ref=useRef(null)

    console.log("ref.current",ref.current)

    return (
        <group {...props} dispose={null}>
            <mesh ref={ref} geometry={nodes.Part1.geometry}>
                <meshStandardMaterial color="gold" metalness={1}
                roughness={0.5}  />
            </mesh>
        </group>
    )
}



export const ExampleTriadPoints = () => {

    const config = useConfig()

    const numberOfPoints = config.points?.length
    const points = config.points

    // console.log(numberOfPoints)
    console.log(points)

    const pointRef = useRef<THREE.InstancedMesh>()
    const cylinderRef = useRef<THREE.InstancedMesh>()

    const sphereRadius = 2
    const triadLength = 30

    // THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight, openEnded )
    var cylGeometry = new THREE.CylinderGeometry(sphereRadius / 10, sphereRadius / 10, triadLength);
// translate the cylinder geometry so that the desired point within the geometry is now at the origin
    cylGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, triadLength / 2, 0));
    // var cylinder = new THREE.Mesh(cylGeometry, cyl_material);


    const colorX = new THREE.Color().setHex(triadArrowColors[0])
    const colorY = new THREE.Color().setHex(triadArrowColors[1])
    const colorZ = new THREE.Color().setHex(triadArrowColors[2])

    const [hovered, setHover] = useState(undefined)

    const orientQuat =[]
    const orientEuler = []


    for (let i = 0; i < numberOfPoints; i++) {
        if(points[i].rotation){
        const orientQuatTemp = new THREE.Quaternion(points[i].rotation.x, points[i].rotation.y, points[i].rotation.z, points[i].rotation.w)
        const orientEulerTemp = new THREE.Euler().setFromQuaternion(orientQuatTemp)
        orientQuat.push(orientQuatTemp)
        orientEuler.push(orientEulerTemp)
        }else{
            const orientQuatTemp = new THREE.Quaternion(0,0,0)
            const orientEulerTemp = new THREE.Euler().setFromQuaternion(orientQuatTemp)
            orientQuat.push(orientQuatTemp)
            orientEuler.push(orientEulerTemp)
        }

    }

    useEffect(() => {
            // if (pointRef === null || cylinderRefX === null) return;
            // if (pointRef.current === null || cylinderRefX.current === null) return;
            console.log(hovered)

            const sphereMesh: any = pointRef.current
            const cylinderMesh: any = cylinderRef.current

            console.log(sphereMesh)
            // console.log(cylinderXMesh)

            for (let i = 0; i < numberOfPoints; i++) {

                const tempObjectSphere = new THREE.Object3D()
                const tempObjectCylinderX = new THREE.Object3D()
                const tempObjectCylinderY = new THREE.Object3D()
                const tempObjectCylinderZ = new THREE.Object3D()

                if (points[i].translation) {
                    tempObjectSphere.position.set(
                        points[i].translation.x,
                        points[i].translation.y,
                        points[i].translation.z,
                    )
                    tempObjectCylinderX.position.set(
                        points[i].translation.x,
                        points[i].translation.y,
                        points[i].translation.z,
                    )
                    tempObjectCylinderY.position.set(
                        points[i].translation.x,
                        points[i].translation.y,
                        points[i].translation.z,
                    )
                    tempObjectCylinderZ.position.set(
                        points[i].translation.x,
                        points[i].translation.y,
                        points[i].translation.z,
                    )
                }

                if (points[i].rotation) {
                    // const orientQuat = new THREE.Quaternion(points[i].rotation.x, points[i].rotation.y, points[i].rotation.z, points[i].rotation.w)
                    // const orientEuler = new THREE.Euler().setFromQuaternion(orientQuat)
                    tempObjectCylinderX.rotation.set(orientEuler[i].x + Math.PI / 2, orientEuler[i].y, orientEuler[i].z)
                    tempObjectCylinderY.rotation.set(orientEuler[i].x, orientEuler[i].y + Math.PI / 2, orientEuler[i].z)
                    tempObjectCylinderZ.rotation.set(orientEuler[i].x, orientEuler[i].y, orientEuler[i].z + Math.PI / 2)

                } else {
                    tempObjectCylinderX.rotation.set(Math.PI / 2, 0, 0)
                    tempObjectCylinderY.rotation.set(0, Math.PI / 2, 0)
                    tempObjectCylinderZ.rotation.set(0, 0, Math.PI / 2)

                }

                tempObjectSphere.updateMatrix();
                tempObjectCylinderX.updateMatrix();
                tempObjectCylinderY.updateMatrix();
                tempObjectCylinderZ.updateMatrix();

                sphereMesh.setMatrixAt(i, tempObjectSphere.matrix)


                cylinderMesh.setColorAt(i * 3, colorX)
                cylinderMesh.setColorAt(i * 3 + 1, colorY)
                cylinderMesh.setColorAt(i * 3 + 2, colorZ)
                cylinderMesh.instanceColor.needsUpdate = true;

                cylinderMesh.setMatrixAt(i * 3, tempObjectCylinderX.matrix)
                cylinderMesh.setMatrixAt(i * 3 + 1, tempObjectCylinderY.matrix)
                cylinderMesh.setMatrixAt(i * 3 + 2, tempObjectCylinderZ.matrix)
                cylinderMesh.instanceMatrix.needsUpdate = true

                // cylinderMesh.setColorAt(i, color.setHex( 0xffffff * Math.random() ));
                // cylinderMesh.setColorAt(i, color.setHex( 0xffffff * Math.random() ));
                // cylinderMesh.setColorAt(i, color.setHex( 0xffffff * Math.random() ));

                cylinderMesh.material.needsUpdate = true;
            }
        }
    )

    const red = new THREE.MeshLambertMaterial()


    return (
        <>
            <instancedMesh ref={cylinderRef} material={red} geometry={cylGeometry}
                           args={[undefined, undefined, numberOfPoints * 3]}>

            </instancedMesh>
            <instancedMesh ref={pointRef} args={[undefined, undefined, numberOfPoints]}
                           onPointerOver={(e) => setHover(e.instanceId)}
                           onPointerOut={(e) => setHover(undefined)}>
                <sphereGeometry args={[sphereRadius, 64, 64]}/>
                <meshBasicMaterial color="black" depthWrite={true}/>
            </instancedMesh>
            <PartModel rotation={[Math.PI/2,Math.PI/2,0]} position={[300,200,0]}/>
            {hovered != undefined &&


                <Html
                    position={[points[hovered].translation.x, points[hovered].translation.y, points[hovered].translation.z]}>
                    <Card title={points[hovered].name} style={{width: 300}}>
                        <p>World
                            position:({(Math.round(points[hovered].translation.x * 100) / 100).toFixed(2)},{(Math.round(points[hovered].translation.y * 100) / 100).toFixed(2)},{(Math.round(points[hovered].translation.z * 100) / 100).toFixed(2)})</p>
                        <p>World rotation:({(Math.round((180/Math.PI)*orientEuler[hovered].x * 100) / 100).toFixed(2)},{(Math.round((180/Math.PI)*orientEuler[hovered].y * 100) / 100).toFixed(2)}, {(Math.round((180/Math.PI)*orientEuler[hovered].z * 100) / 100).toFixed(2)})</p>
                        <p>Frame name: Part1</p>
                        <p>Postion in frame: (0, 10, 40)</p>
                        <p>Rotation in frame: (0, 0, 0, 1)</p>
                    </Card>
                </Html>
            }
        </>
    )
}
