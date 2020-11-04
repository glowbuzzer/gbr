import GCodeInterpreter from "./GCodeInterpreter"
import { EllipseCurve, Vector3 } from "three"

// responsible for converting gcode to internal representation and doing buffered send to m4

const gcode_axes = ["X", "Y", "Z"] // case-sensitive as found in gcode, eg. G0 X100

// default move params
const moveParams = {
    vmaxPercentage: 100,
    amaxPercentage: 100,
    jmaxPercentage: 100,
    blendType: 0,
    blendTimePercentage: 100
}

function update_all_modals(params, current_positions) {
    Object.keys(params).forEach(k => update_axis(k, params[k], current_positions))
}

function update_axis(axis, value, current_positions) {
    const index = gcode_axes.indexOf(axis)
    if (index < 0) {
        return
    }
    current_positions[index] = value
}

function arcParams(params, ccw, current_positions) {
    const start = new Vector3(current_positions[0], current_positions[1], current_positions[2])
    update_all_modals(params, current_positions)
    const end = new Vector3(current_positions[0], current_positions[1], current_positions[2])

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

    console.log("arc start=", start, "end=", end, "centre", centre, "start_angle=", start_angle, "end_angle=", end_angle, "waypoint=", midpoint)
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

export class GCodeAdapter extends GCodeInterpreter {
    constructor(buffer, current_positions) {
        super({
            handlers: {
                M2() {
                    buffer.push({
                        activityType: 18 // ENDPROGRAM
                    })
                },
                G0(params) {
                    update_all_modals(params, current_positions)

                    buffer.push({
                        activityType: 5, // move to position
                        moveToPosition: {
                            moveParams,
                            cartesianPosition: {
                                configuration: 0, // not needed for cartesian machine
                                position: {
                                    position: {
                                        x: current_positions[0],
                                        y: current_positions[1],
                                        z: current_positions[2]
                                    }
                                }
                            }
                        }
                    })
                },
                G1(params) {
                    update_all_modals(params, current_positions)

                    buffer.push({
                        activityType: 1, // move line
                        moveLine: {
                            moveParams,
                            line: {
                                position: {
                                    x: current_positions[0],
                                    y: current_positions[1],
                                    z: current_positions[2]
                                }
                            }
                        }
                    })
                },
                G2(params) {
                    buffer.push({
                        activityType: 2, // move arc cw
                        moveArc: {
                            moveParams,
                            ...arcParams(params, false, current_positions)
                        }
                    })
                },
                G3(params) {
                    buffer.push({
                        activityType: 2, // move arc ccw
                        moveArc: {
                            moveParams,
                            ...arcParams(params, true, current_positions)
                        }
                    })
                },
                G61() {
                    // exact stop mode (the default)
                    moveParams.blendType = 0 // NOBLEND
                },
                G64() {
                    moveParams.blendType = 1 // OVERLAPPED
                    // TODO: this should be tolerance in overlapped scheme
                    // moveParams.radius = params.P || 1e99; // big number meaning go as fast as possible!
                }
            },
            defaultHandler(cmd, params) {
                console.log("Unhandled gcode: ", cmd, params)
            }
        })
    }
}
