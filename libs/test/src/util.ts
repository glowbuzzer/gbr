import { Euler, Quaternion } from "three"
import { gbc } from "../gbc"

const px = state => state.status.kc[0].position.translation.x
const py = state => state.status.kc[0].position.translation.y
const pz = state => state.status.kc[0].position.translation.z

const aw = state => state.status.kc[0].position.rotation.w
const ax = state => state.status.kc[0].position.rotation.x
const ay = state => state.status.kc[0].position.rotation.y
const az = state => state.status.kc[0].position.rotation.z

export function assertNear(x, y, z, a, b, c) {
    const q = new Quaternion().setFromEuler(new Euler(a, b, c))

    // console.log("EULER", a, b, c, "Q", q.w, q.x, q.y, q.z)

    // console.log(
    //     "JOINTS",
    //     gbc.status.joint.map(j => MathUtils.radToDeg(j.actPos).toFixed(0)),
    //     "P",
    //     gbc.get(px),
    //     gbc.get(py),
    //     gbc.get(pz),
    //     "Q",
    //     gbc.get(ax),
    //     gbc.get(ay),
    //     gbc.get(az),
    //     gbc.get(aw)
    // )

    gbc.assert.near(px, x, 0.01)
    gbc.assert.near(py, y, 0.01)
    gbc.assert.near(pz, z, 0.01)

    // we allow negative values for expected because quaternion can be flipped
    gbc.assert.near(aw, q.w, 0.01, true)
    gbc.assert.near(ax, q.x, 0.01, true)
    gbc.assert.near(ay, q.y, 0.01, true)
    gbc.assert.near(az, q.z, 0.01, true)
}

