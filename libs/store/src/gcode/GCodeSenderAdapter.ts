import GCodeInterpreter from "./GCodeInterpreter"
import { EllipseCurve, Vector3 } from "three"
import { GCodeLine } from "./lineParser"

// responsible for converting gcode to internal representation and doing buffered send to m4

function arcParams(params, ccw, start, end, frameIndex) {
    params.I = params.I || 0
    params.J = params.J || 0

    const offset = new Vector3(params.I, params.J, start.z)

    const centre = new Vector3().addVectors(start, offset)

    const vs = new Vector3().subVectors(start, centre)
    const ve = new Vector3().subVectors(end, centre)

    const start_angle = Math.atan2(vs.y, vs.x)
    const end_angle = Math.atan2(ve.y, ve.x)

    const curve = new EllipseCurve(centre.x, centre.y, offset.length(), offset.length(), start_angle, end_angle, !ccw /* not sure why? */, 0)

    const midpoint = curve.getPointAt(0.5) // get the point half way along the arc

    // console.log("arc start=", start, "end=", end, "centre", centre, "start_angle=", start_angle, "end_angle=", end_angle, "waypoint=", midpoint)
    // TODO: check if midpoint is distinct from start/end
    return {
        arc: {
            destination: {
                frameIndex,
                position: {
                    x: end.x,
                    y: end.y,
                    z: end.z
                }
            },
            waypoint: {
                frameIndex,
                position: {
                    x: midpoint.x,
                    y: midpoint.y,
                    z: end.z
                }
            }
        }
    }
}

function args(line: GCodeLine) {
    return {
        tag: line.lineNum
    }
}

// noinspection JSUnusedGlobalSymbols
export class GCodeSenderAdapter extends GCodeInterpreter {
    // default move params
    private moveParams = {
        vmaxPercentage: 100,
        amaxPercentage: 100,
        jmaxPercentage: 100,
        blendType: 0,
        blendTimePercentage: 100
    }
    private frameIndex = 0

    private readonly buffer: any[]

    constructor(buffer, current_positions) {
        super(current_positions)

        this.buffer = buffer
    }

    M2() {
        this.buffer.push({
            activityType: 18 // ENDPROGRAM
        })
    }

    M8() {
        this.buffer.push({
            activityType: 18 // ENDPROGRAM
        })
    }

    M200(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: 11, // SET DOUT
            ...args(line),
            setDout: {
                doutToSet: U || 0,
                valueToSet: Boolean(V).valueOf() || false
            }
        })
    }

    M201(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: 12, // SET AOUT
            ...args(line),
            setDout: {
                doutToSet: U || 0,
                valueToSet: Number(V).valueOf() || 0
            }
        })
    }

    M202(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: 19, // SET IOUT
            ...args(line),
            setDout: {
                doutToSet: U || 0,
                valueToSet: Number(V).valueOf() || 0
            }
        })
    }

    G0(params, line: GCodeLine) {
        this.updateModals(params)

        this.buffer.push({
            activityType: 5, // move to position
            ...args(line),
            moveToPosition: {
                moveParams: this.moveParams,
                cartesianPosition: {
                    configuration: 0, // not needed for cartesian machine
                    position: {
                        position: {
                            x: this.current_positions[0],
                            y: this.current_positions[1],
                            z: this.current_positions[2]
                        },
                        frameIndex: this.frameIndex
                    }
                }
            }
        })
    }

    G1(params, line: GCodeLine) {
        this.updateModals(params)

        this.buffer.push({
            activityType: 1, // move line
            ...args(line),
            moveLine: {
                moveParams: this.moveParams,
                line: {
                    position: {
                        x: this.current_positions[0],
                        y: this.current_positions[1],
                        z: this.current_positions[2]
                    },
                    frameIndex: this.frameIndex
                }
            }
        })
    }

    G2(params, line: GCodeLine) {
        const start = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])
        this.updateModals(params)
        const end = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])

        this.buffer.push({
            activityType: 2, // move arc cw
            ...args(line),
            moveArc: {
                moveParams: this.moveParams,
                ...arcParams(params, false, start, end, this.frameIndex)
            }
        })
    }

    G3(params, line: GCodeLine) {
        const start = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])
        this.updateModals(params)
        const end = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])

        this.buffer.push({
            activityType: 2, // move arc ccw
            ...args(line),
            moveArc: {
                moveParams: this.moveParams,
                ...arcParams(params, true, start, end, this.frameIndex)
            }
        })
    }

    G4(params, line: GCodeLine) {
        this.buffer.push({
            activityType: 13, // dwell
            ...args(line),
            dwell: {
                ticksToDwell: params.P || 0
            }
        })
    }

    G53() {
        this.frameIndex = 0
    }

    G54() {
        this.frameIndex = 1
    }

    G55() {
        this.frameIndex = 2
    }

    G56() {
        this.frameIndex = 3
    }

    G57() {
        this.frameIndex = 4
    }

    G58() {
        this.frameIndex = 5
    }

    G59() {
        this.frameIndex = 6
    }

    G61() {
        // exact stop mode (the default)
        this.moveParams.blendType = 0 // NOBLEND
    }

    G64() {
        this.moveParams.blendType = 1 // OVERLAPPED
        // TODO: this should be tolerance in overlapped scheme
        // moveParams.radius = params.P || 1e99; // big number meaning go as fast as possible!
    }
}
