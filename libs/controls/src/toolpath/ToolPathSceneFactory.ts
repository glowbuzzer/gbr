import * as THREE from "three"
import { DoubleSide, LineBasicMaterial, PointLight, Vector3 } from "three"
import { OrbitControls } from "./OrbitControls"
import { GCodeSegment } from "@glowbuzzer/store"

if (typeof window !== "undefined") {
    const wnd = window as any
    wnd.THREE = THREE
}

function toVector3(vals: number[]) {
    const [x, y, z] = vals
    return new Vector3(x, y, z)
}

export type ToolPathScene = {
    render(): void
    setPath(path: any): void
    setPreview(segments: GCodeSegment[]): void
}

export const ToolPathSceneFactory = (container: any, width: number, height: number, extent: number): ToolPathScene => {
    const [w, h] = [width, height]
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.01, 10000)
    // camera.position.y = -.75;
    camera.position.z = 2 * extent
    // camera.position.x = 0.25;
    camera.up.set(0, 0, 1)

    const scene = new THREE.Scene()

    const gridHelper = new THREE.GridHelper(2 * extent, 20, undefined, 0xc0c0c0)
    gridHelper.rotateX(Math.PI / 2)
    scene.add(gridHelper)

    const light1 = new THREE.PointLight(0xc0c0c0, 1, 30 * extent)
    light1.position.set(extent, extent, extent)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xc0c0c0, 1, 30 * extent)
    light2.position.set(extent, -extent, extent)
    scene.add(light2)

    const light3 = new THREE.PointLight(0xc0c0c0, 1, 30 * extent)
    light3.position.set(-extent, -extent, extent)
    scene.add(light3)

    const lights = []
    lights[0] = new PointLight(0xffffff, 1, 0)
    lights[1] = new PointLight(0xffffff, 1, 0)
    lights[2] = new PointLight(0xffffff, 1, 0)

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)

    scene.add(lights[0])
    scene.add(lights[1])
    scene.add(lights[2])

    const pathMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff })
    const pathVertices: Vector3[] = []
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathVertices)
    const line = new THREE.Line(pathGeometry, pathMaterial)
    scene.add(line)

    const previewMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    const previewGeometry = new THREE.BufferGeometry().setFromPoints([])
    const preview = new THREE.LineSegments(previewGeometry, previewMaterial)
    scene.add(preview)
    // function hsl(h, s, l) {
    //     return (new THREE.Color()).setHSL(h, s, l);
    // }

    const fulcrumGeometry = new THREE.ConeGeometry(0.1 * extent, 0.3 * extent, 3, 1, false, 0, Math.PI * 2)
    const fulcrumMaterial = new THREE.MeshPhongMaterial({
        color: "#000099",
        opacity: 0.2,
        transparent: true,
        side: DoubleSide,
        flatShading: true
    })
    const fulcrum = new THREE.Mesh(fulcrumGeometry, fulcrumMaterial)
    fulcrum.position.z = extent / 2
    fulcrum.rotation.set(-Math.PI / 2, 0, 0)
    scene.add(fulcrum)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(w, h)

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    ;(controls as any).addEventListener("change", () => {
        renderer.render(scene, camera)
    })

    renderer.render(scene, camera)

    window.addEventListener("resize", onWindowResize, false)

    function onWindowResize() {
        const { clientWidth } = container
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        renderer.setSize(clientWidth, clientWidth / camera.aspect)
        renderer.render(scene, camera)
    }

    onWindowResize()

    return {
        render() {
            renderer.render(scene, camera)
        },
        setPath(path: any[]): void {
            const vertices = path.map(p => new Vector3(p.x, p.y, p.z))
            pathVertices.splice(0, pathVertices.length, ...vertices)
            pathGeometry.setFromPoints(pathVertices)
            const last = vertices[vertices.length - 1]
            fulcrum.position.set(last.x, last.y, last.z + (0.3 * extent) / 2)
            ;(line.geometry as any).attributes.position.needsUpdate = true
            renderer.render(scene, camera)
        },
        setPreview(segments: GCodeSegment[]) {
            previewGeometry.setFromPoints(segments.flatMap(s => [toVector3(s.from), toVector3(s.to)]))
            previewMaterial.setValues({ color: 0x0, vertexColors: true })
            ;(preview.geometry as any).attributes.position.needsUpdate = true
            renderer.render(scene, camera)
        }
    }
}
