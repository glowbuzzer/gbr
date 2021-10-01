import GCodeInterpreter from "../gcode/GCodeInterpreter"
import { GCodeSegment } from "./index"
import { EllipseCurve, Quaternion, Vector3 } from "three"

function fromVector3(p: Vector3): number[] {
    return [p.x, p.y, p.z]
}

function fromHexString(s: string) {
    // convert web color code, eg '#c0c0c0' into THREE rgb floats in range [0,1]
    const num = parseInt(s.substr(1), 16)
    const r = num >> 16
    const g = (num & 0xff00) >> 8
    const b = num & 0xff

    return [r / 255, g / 255, b / 255]
}

const RAPID_COLOR = fromHexString("#a94d4d")
const MOVE_COLOR = fromHexString("#a7c0fd")

export class GCodePreviewAdapter extends GCodeInterpreter {
    readonly segments: GCodeSegment[] = []
    private frameIndex = 0
    // private kcFrame: number
    private convertToFrame

    constructor(current_positions: { x: number; y: number; z: number }, convertToFrame) {
        super(current_positions)
        // this.kcFrame = kcFrame
        this.convertToFrame = convertToFrame
        this.frame_conversion = this.frame_conversion.bind(this)
    }

    private frame_conversion(point) {
        const [x, y, z] = point
        const pos = new Vector3(x, y, z)
        const rot = new Quaternion(0, 0, 0, 1)
        const new_pos = this.convertToFrame(pos, rot, this.frameIndex, "world").position
        return [new_pos.x, new_pos.y, new_pos.z]
    }

    toSegments(points: Vector3[], color: number[], lineNum?: number): GCodeSegment[] {
        const result: GCodeSegment[] = []
        points.slice(1).forEach((p, index) =>
            result.push({
                from: fromVector3(points[index]),
                to: fromVector3(p),
                color,
                lineNum
            })
        )
        return result
    }

    toArc(params, ccw: boolean, from, to): EllipseCurve {
        const [[x1, y1], [x2, y2]] = [from, to]
        const I = params.I || 0
        const J = params.J || 0

        // const offset = new Vector3(I, J, 0)
        const [cx, cy] = [x1 + I, y1 + J]

        const r = Math.hypot(x1 - cx, y1 - cy)
        const r_check = Math.hypot(x2 - cx, y2 - cy)
        const delta = Math.abs(r - r_check)
        if (delta > 0.001) {
            // TODO: error handling
            console.error("Invalid arc - points not equidistant from centre!", delta)
        }
        const startAngle = Math.atan2(y1 - cy, x1 - cx)
        const endAngle = Math.atan2(y2 - cy, x2 - cx)
        return new EllipseCurve(cx, cy, r, r, startAngle, endAngle, !ccw /* not sure why? */, 0)
    }

    G0(params, { lineNum }, from, to) {
        // const [from, to] = this.updatePositions(params).map(this.frame_conversion)
        this.segments.push({
            from,
            to,
            color: RAPID_COLOR,
            lineNum
        })
    }

    G1(params, { lineNum }, from, to) {
        // const [from, to] = this.updatePositions(params).map(this.frame_conversion)
        // console.log("LINE FROM", from, "TO", to)
        this.segments.push({
            from,
            to,
            color: MOVE_COLOR,
            lineNum
        })
    }

    G2(params, { lineNum }, from, to) {
        const arc = this.toArc(params, false, from, to)
        const points = arc.getPoints(10).map(p => new Vector3(p.x, p.y, 0))
        this.segments.push(...this.toSegments(points, MOVE_COLOR, lineNum))
    }

    G3(params, { lineNum }, from, to) {
        const arc = this.toArc(params, true, from, to)
        const points = arc.getPoints(10).map(p => new Vector3(p.x, p.y, 0))
        this.segments.push(...this.toSegments(points, MOVE_COLOR, lineNum))
    }

    G54() {
        this.frameIndex = 0
    }

    G55() {
        this.frameIndex = 1
    }

    G56() {
        this.frameIndex = 2
    }

    G57() {
        this.frameIndex = 3
    }

    G58() {
        this.frameIndex = 4
    }

    G59() {
        this.frameIndex = 5
    }
}
