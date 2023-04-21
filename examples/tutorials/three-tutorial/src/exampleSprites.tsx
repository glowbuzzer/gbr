import * as React from "react"
import {
    useRef,
    Fragment
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    Html,
    Text,
    Instance,
    Instances
} from "@react-three/drei"
import {useFrame} from "@react-three/fiber"


export const ExampleSprites = ({i,j}) =>{

    const spriteGeometry = new THREE.BufferGeometry()
    const spriteVertices = [];

    const labels = [];


    for (let i = 0; i < 10; i++) {
        labels.push({
            position: [ 200, -250+i*50, 500-25],
            labelText: `label #${i}`
        })
    }

console.log(labels)

    const sprite = new THREE.TextureLoader().load("/textures/point.png");



    for (let i = 0; i < 10; i++) {
        const x = 200
        const y = -250+i*50
        const z = 500
        spriteVertices.push(x, y, z);
    }

    spriteGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(spriteVertices, 3)
    )



    return (
        <>
                <Html style={{
                    width: "500px",
                }}
                      position={[-1000,1000,0]}>
                    <h1>Example 5 - using sprites and text to label objects on your canvas</h1></Html>

                <points args={[spriteGeometry]}>
            <pointsMaterial
                size={50}
                sizeAttenuation={true}
                alphaTest={0.5}
                map={sprite}
                transparent={true}
            />
        </points>

    {labels.map((label, index) => (
        <Fragment key={index}>
            <Html center position={label.position}>
                <div style={{color: "black"}}>{label.labelText}</div>
            </Html>
        </Fragment>
    ))}

            <Html center position={[500,500,500]}>
                <div style={{color: "black"}}>hehehehe</div>
                {/*<h1>hehehehe</h1>*/}
            </Html>
    </>

)
}

