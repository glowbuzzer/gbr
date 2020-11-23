import { Matrix4, Vector3 } from "three"
import { AbstractSimulatedActivity } from "./AbstractSimulatedActivity"

export class SimulatedArc extends AbstractSimulatedActivity {
    private readonly waypoint: Vector3
    private cw: boolean
    private arcAngle: number
    private radius: number
    private matrix: Matrix4

    constructor(config) {
        const { x, y, z } = config.moveArc.arc.destination.position
        super(new Vector3(x, y, z))

        const { x: wx, y: wy, z: wz } = config.moveArc.arc.waypoint.position
        this.waypoint = new Vector3(wx, wy, wz)
    }

    init(tcp: Vector3) {
        this.start = tcp.clone()
        this.distance = this.start.distanceTo(this.end)

        const { start, end, waypoint } = this
        const v1 = new Vector3().subVectors(end, start)
        const v2 = new Vector3().subVectors(waypoint, start)

        const v1v1 = v1.dot(v1)
        const v2v2 = v2.dot(v2)
        const v1v2 = v1.dot(v2)

        const base = 0.5 / (v1v1 * v2v2 - v1v2 * v1v2)
        const k1 = base * v2v2 * (v1v1 - v1v2)
        const k2 = base * v1v1 * (v2v2 - v1v2)

        v1.multiplyScalar(k1)
        v2.multiplyScalar(k2)

        const c = new Vector3()
        c.addVectors(start, v1)
        c.add(v2)

        const r = c.distanceTo(start)
        this.radius = r

        console.log("ARC: centre=", c, "radius=", r, "start=", start, "end=", end, "waypoint=", waypoint, "k1=", k1, "k2=", k2)

        const [s, e] = [start, end].map(p => new Vector3().subVectors(p, c))

        const dp1 = s.dot(e)
        const cos_theta = dp1 / (r * r)

        // calc the angle for the arc
        const theta1 = Math.abs(cos_theta) > 1 ? 0 : Math.acos(cos_theta)

        const csct = 1 / Math.sin(theta1)
        const cott = 1 / Math.tan(theta1)

        // this is the unit vector orthogonal to the plane of the arc
        const ortho1 = new Vector3().crossVectors(s, e).normalize()

        this.matrix = new Matrix4()
            .fromArray([
                s.x / r,
                (csct * e.x - cott * s.x) / r,
                ortho1.x,
                c.x,
                s.y / r,
                (csct * e.y - cott * s.y) / r,
                ortho1.y,
                c.y,
                s.z / r,
                (csct * e.z - cott * s.z) / r,
                ortho1.z,
                c.z,
                0,
                0,
                0,
                1
            ])
            .transpose() // three uses row major order

        const m_inverse = new Matrix4().getInverse(this.matrix)

        const up2 = waypoint.clone().applyMatrix4(m_inverse)
        const up3 = end.clone().applyMatrix4(m_inverse)

        const angle2 = Math.atan2(up2.y, up2.x)
        const angle3 = Math.atan2(up3.y, up3.x)

        this.cw = angle2 < 0 || angle2 > angle3
        this.arcAngle = this.cw ? 2 * Math.PI - theta1 : theta1
        this.distance = r * this.arcAngle
    }

    exec_internal(tcp: Vector3, elapsed_ticks: number) {
        const current_angle = ((this.cw ? -1 : 1) * this.arcAngle * this.tick) / elapsed_ticks
        const pos = new Vector3(Math.cos(current_angle) * this.radius, Math.sin(current_angle) * this.radius, 0)
        pos.applyMatrix4(this.matrix)
        tcp.set(pos.x, pos.y, pos.z)
    }
}
