import GCodeInterpreter from "./GCodeInterpreter"
import { EllipseCurve, Vector3 } from "three"
import { GCodeLine } from "./lineParser"

// responsible for converting gcode to internal representation and doing buffered send to m4

// default move params
const moveParams = {
    vmaxPercentage: 100,
    amaxPercentage: 100,
    jmaxPercentage: 100,
    blendType: 0,
    blendTimePercentage: 100
}

function arcParams(params, ccw, start, end) {
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
                position: {
                    x: end.x,
                    y: end.y,
                    z: end.z
                }
            },
            waypoint: {
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

    G0(params, line: GCodeLine) {
        this.updateModals(params)

        this.buffer.push({
            activityType: 5, // move to position
            ...args(line),
            moveToPosition: {
                moveParams,
                cartesianPosition: {
                    configuration: 0, // not needed for cartesian machine
                    position: {
                        position: {
                            x: this.current_positions[0],
                            y: this.current_positions[1],
                            z: this.current_positions[2]
                        }
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
                moveParams,
                line: {
                    position: {
                        x: this.current_positions[0],
                        y: this.current_positions[1],
                        z: this.current_positions[2]
                    }
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
                moveParams,
                ...arcParams(params, false, start, end)
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
                moveParams,
                ...arcParams(params, true, start, end)
            }
        })
    }

    G61() {
        // exact stop mode (the default)
        moveParams.blendType = 0 // NOBLEND
    }

    G64() {
        moveParams.blendType = 1 // OVERLAPPED
        // TODO: this should be tolerance in overlapped scheme
        // moveParams.radius = params.P || 1e99; // big number meaning go as fast as possible!
    }
}
