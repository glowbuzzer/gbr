import * as React from "react"
import {
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useMemo,
    useState
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
    Sparkles,
    Svg,
    Line,
    Points,
    Point
} from "@react-three/drei"
import {
    useThree,
    useFrame,
    useLoader
} from "@react-three/fiber"
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader'

import {EffectComposer, GodRays} from "@react-three/postprocessing"
import {BlendFunction, Resizer, KernelSize} from "postprocessing";

import {Smoke} from "./smoke"

const Laser = forwardRef<THREE.Mesh, any>(function Laser(props, ref) {
    const innerRef = useRef(null)
    useImperativeHandle(ref, () => innerRef.current)

    const smokeRef = useRef<THREE.Group>(null)


    const spriteGeometry = new THREE.BufferGeometry()
    const sprite = new THREE.TextureLoader().load("/png/star.png");

    const data = useLoader(SVGLoader, "/svg/glowbuzzer.svg")
    // const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))), [
    //     data
    // ])

    console.log(data)

    const pointsFlat = useMemo(() => {
            const temp = []
            data.paths.forEach((path) =>
                temp.push(path.subPaths[0].getPoints())
            )
            return temp.flat()
        }
        , [data.paths]);

    console.log("pointsFlat", pointsFlat)

    const axis = new THREE.Vector3(1, 0, 0);
    const vertices = useMemo(() => pointsFlat.map(point => new THREE.Vector3(point.x+props.position[0], point.y+props.position[1], props.position[2]).applyAxisAngle(axis, Math.PI)), [pointsFlat])
    console.log("vertices", vertices)

    const totalPointsCount = vertices.length
    console.log("totalPointsCount", totalPointsCount)


    const justPoints = []
    for (let i = 0; i < totalPointsCount; i++) {
        justPoints.push(vertices[i].x)
        justPoints.push(vertices[i].y)
        justPoints.push(0)
    }

    spriteGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(justPoints, 3)
    )



    useFrame(({clock}) => {
        if (innerRef.current) {

            var prog = Math.round(clock.getElapsedTime() * 200) % totalPointsCount

            innerRef.current.position.x = vertices[prog].x
            innerRef.current.position.y = vertices[prog].y
        }

        spriteGeometry.setDrawRange(0, prog)

        console.log(smokeRef)
        if (smokeRef.current) {
            smokeRef.current.position.x =vertices[prog].x
            smokeRef.current.position.y =vertices[prog].y

        }
    });


// console.log("slice",vertices.slice(0,progress+1))
//     console.log("progress",progress)

    return (
        <>
            <points args={[spriteGeometry]}>
                <pointsMaterial
                    size={10}
                    sizeAttenuation={true}
                    alphaTest={0.5}
                    map={sprite}
                    transparent={true}
                />
            </points>


            {/*<Line ref={myline} points={vertices.slice(0,progress+1)} color="red" />*/}

            <Sphere ref={innerRef} position={[0, 0, 3]} args={[1.5, 64, 64]}>
                <meshBasicMaterial color={"red"}/>
            </Sphere>

            <Smoke
                ref={smokeRef}
                scale={[2,2,2]}
                position={[200,0,50]}
                opacity={1.5}
                speed={0.8} // Rotation speed
                width={10} // Width of the full cloud
                depth={1.5} // Z-dir depth
                segments={40} // Number of particles
            />
        </>
    );
});

function LaserEffect() {
    // const [laserRef, setLaserRef] = useState(null)
    const laserRef = useRef<THREE.Mesh>(null)


    return (
        <>
            <Laser ref={laserRef} position={[200,200,0]}/>
            {laserRef.current != null && (
                <>
                    <EffectComposer multisampling={0}>
                        <GodRays
                            sun={laserRef.current}
                            blendFunction={BlendFunction.SCREEN}
                            samples={60} // The number of samples per pixel.
                            density={1.97}// The density of the light rays.
                            decay={0.96}  // An illumination decay factor.
                            weight={0.8} // A light ray weight factor.
                            exposure={0.4}// A constant attenuation coefficient.
                            clampMax={1}// An upper bound for the saturation of the overall effect.
                            kernelSize={KernelSize.LARGE}
                            blur={1}
                        />
                    </EffectComposer>
                </>
            )}
        </>
    );
}


export const ExampleLaserCutting = () => {
    const svgRef = useRef()

    return (
        <>
            {/*<Svg ref={svgRef} src={"/svg/glowbuzzer.svg"} position={[0,0,0]} />*/}
            <LaserEffect/>
        </>
    )
}