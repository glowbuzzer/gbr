/*
 * Copied from the standard THREE ArrowHelper class, but with opacity support.
 */

import {
    BufferGeometry,
    CylinderGeometry,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Vector3
} from "three"

const _axis = new Vector3()

let _lineGeometry: BufferGeometry
let _coneGeometry: CylinderGeometry

export class ArrowHelperWithOpacity extends Object3D {
    private readonly line: Line<BufferGeometry, LineBasicMaterial>
    private readonly cone: Mesh<CylinderGeometry, MeshBasicMaterial>

    constructor(
        dir = new Vector3(0, 0, 1),
        origin = new Vector3(0, 0, 0),
        length = 1,
        color = 0xffff00,
        opacity: number = 1,
        headLength = length * 0.2,
        headWidth = headLength * 0.2
    ) {
        super()

        this.type = "ArrowHelper"

        if (_lineGeometry === undefined) {
            _lineGeometry = new BufferGeometry()
            _lineGeometry.setAttribute(
                "position",
                new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3)
            )

            _coneGeometry = new CylinderGeometry(0, 0.5, 1, 5, 1)
            _coneGeometry.translate(0, -0.5, 0)
        }

        this.position.copy(origin)

        this.line = new Line(
            _lineGeometry,
            new LineBasicMaterial({
                color: color,
                toneMapped: false,
                transparent: opacity < 1,
                opacity
            })
        )
        this.line.matrixAutoUpdate = false
        this.add(this.line)

        this.cone = new Mesh(
            _coneGeometry,
            new MeshBasicMaterial({
                color: color,
                toneMapped: false,
                transparent: opacity < 1,
                opacity
            })
        )
        this.cone.matrixAutoUpdate = false
        this.add(this.cone)

        this.setDirection(dir)
        this.setLength(length, headLength, headWidth)
    }

    setDirection(dir) {
        // dir is assumed to be normalized

        if (dir.y > 0.99999) {
            this.quaternion.set(0, 0, 0, 1)
        } else if (dir.y < -0.99999) {
            this.quaternion.set(1, 0, 0, 0)
        } else {
            _axis.set(dir.z, 0, -dir.x).normalize()

            const radians = Math.acos(dir.y)

            this.quaternion.setFromAxisAngle(_axis, radians)
        }
    }

    setLength(length, headLength = length * 0.2, headWidth = headLength * 0.2) {
        this.line.scale.set(1, Math.max(0.0001, length - headLength), 1) // see #17458
        this.line.updateMatrix()

        this.cone.scale.set(headWidth, headLength, headWidth)
        this.cone.position.y = length
        this.cone.updateMatrix()
    }

    copy(source) {
        super.copy(source, false)

        this.line.copy(source.line)
        this.cone.copy(source.cone)

        return this
    }

    // noinspection JSUnusedGlobalSymbols
    dispose() {
        this.line.geometry.dispose()
        this.line.material.dispose()
        this.cone.geometry.dispose()
        this.cone.material.dispose()
    }
}
