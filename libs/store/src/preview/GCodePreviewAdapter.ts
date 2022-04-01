import GCodeInterpreter from "../gcode/GCodeInterpreter"
import { GCodeSegment } from "./index"
import { EllipseCurve, Quaternion, Vector3 } from "three"
import { CartesianPosition, POSITIONREFERENCE } from "../gbc"

function fromHexString(s: string) {
    // convert web color code, eg '#c0c0c0' into THREE rgb floats in range [0,1]
    const num = parseInt(s.substr(1), 16)
    const r = num >> 16
    const g = (num & 0xff00) >> 8
    const b = num & 0xff

    return [r / 255, g / 255, b / 255]
}

const RAPID_COLOR = fromHexString("#a94d4d")
const MOVE_COLOR = fromHexString("#0037be")

export class GCodePreviewAdapter extends GCodeInterpreter {
    readonly segments: GCodeSegment[] = []
    // private frameIndex = 0
    private kcFrame: number
    private convertToFrame

    constructor(currentPosition: CartesianPosition, kcFrame, convertToFrame) {
        super(currentPosition)
        this.kcFrame = kcFrame
        this.convertToFrame = convertToFrame
        this.frame_conversion = this.frame_conversion.bind(this)
    }

    protected shiftPositions(prev, next) {
        if (next.positionReference === POSITIONREFERENCE.RELATIVE) {
            console.log("SHIFT", prev.translation, next.translation)
            return [
                prev,
                {
                    ...next,
                    translation: {
                        x: next.translation.x + prev.translation.x,
                        y: next.translation.y + prev.translation.y,
                        z: next.translation.z + prev.translation.z
                    }
                }
            ]
        }
        return super.shiftPositions(prev, next)
    }

    private frame_conversion(cartesianPosition: CartesianPosition) {
        const { x, y, z } = cartesianPosition.translation
        const pos = new Vector3(x, y, z)
        const rot = new Quaternion(0, 0, 0, 1)
        return this.convertToFrame(pos, rot, cartesianPosition.frameIndex, "world").translation
    }

    toSegments(points: Vector3[], color: number[], lineNum?: number): GCodeSegment[] {
        const result: GCodeSegment[] = []
        points.slice(1).forEach((p, index) =>
            result.push({
                from: points[index],
                to: p,
                color,
                lineNum
            })
        )
        return result
    }

    pushArc(
        lineNum: number,
        params,
        ccw: boolean,
        fromCp: CartesianPosition,
        toCp: CartesianPosition
    ) {
        // convert start and end into same frame as current
        const [from, to] = [fromCp, toCp].map(position =>
            this.convertToFrame(
                position.translation,
                position.rotation || new Quaternion().identity(),
                position.frameIndex,
                this.position.frameIndex
            )
        )
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = [from.translation, to.translation]
        const I = params.I || 0
        const J = params.J || 0

        // const offset = new Vector3(I, J, 0)
        const [cx, cy] = [x1 + I, y1 + J]

        const r = Math.hypot(x1 - cx, y1 - cy)
        const r_check = Math.hypot(x2 - cx, y2 - cy)
        const delta = Math.abs(r - r_check)
        if (delta > 0.001) {
            // TODO: error handling
            console.error(
                "Invalid arc - points not equidistant from centre!",
                delta,
                x1,
                y1,
                x2,
                y2
            )
        }
        const startAngle = Math.atan2(y1 - cy, x1 - cx)
        const endAngle = Math.atan2(y2 - cy, x2 - cx)
        const arc = new EllipseCurve(
            cx,
            cy,
            r,
            r,
            startAngle,
            endAngle,
            !ccw /* not sure why? */,
            0
        )

        // TODO: H: what happens if from and to are in different frames?
        const points = arc.getPoints(10).map(p => ({
            ...this.position,
            translation: {
                ...this.position.translation,
                x: p.x,
                y: p.y
            }
        }))
        this.segments.push(
            ...this.toSegments(
                points.map(p => {
                    const { x, y, z } = this.frame_conversion(p)
                    return new Vector3(x, y, z)
                }),
                MOVE_COLOR,
                lineNum
            )
        )
    }

    G0(params, { lineNum }, fromCp: CartesianPosition, toCp: CartesianPosition) {
        // const [from, to] = this.updatePositions(params).map(this.frame_conversion)
        const [from, to] = [fromCp, toCp].map(position => this.frame_conversion(position))
        this.segments.push({
            from,
            to,
            color: RAPID_COLOR,
            lineNum
        })
    }

    G1(params, { lineNum }, from, to) {
        this.segments.push({
            from: this.frame_conversion(from),
            to: this.frame_conversion(to),
            color: MOVE_COLOR,
            lineNum
        })
    }

    G2(params, { lineNum }, from, to) {
        this.pushArc(lineNum, params, false, from, to)
    }

    G3(params, { lineNum }, from, to) {
        this.pushArc(lineNum, params, true, from, to)
    }
}
