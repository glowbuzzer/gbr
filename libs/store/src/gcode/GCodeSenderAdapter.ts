import GCodeInterpreter from "./GCodeInterpreter"
import { GCodeLine } from "./lineParser"
import { ActivityStreamItem, ACTIVITYTYPE, ARCDIRECTION, ARCTYPE, BLENDTYPE, MoveArcStream, POSITIONREFERENCE, SetAoutCommand, SetDoutCommand, SetIoutCommand } from "../gbc"

// responsible for converting gcode to internal representation and doing buffered send to m4

function number_or_null(v) {
    return v === undefined ? null : Number(v)
}

function arcParams(params, ccw, frameIndex, positionReference): MoveArcStream {
    const I = params.I || 0
    const J = params.J || 0
    const R = params.R || 0

    const x = number_or_null(params.X)
    const y = number_or_null(params.Y)
    const z = number_or_null(params.Z)

    const destination={
        frameIndex,
        position: { x, y, z },
        positionReference
    }

    const arcDirection=ccw ? ARCDIRECTION.ARCDIRECTION_CCW : ARCDIRECTION.ARCDIRECTION_CW

    if ( Math.abs(R) > 0 ) {
        return {
            arc: {
                destination,
                arcType: ARCTYPE.ARCTYPE_RADIUS,
                radius: {value: R},
                arcDirection
            }
        }
    }

    return {
        arc: {
            destination,
            arcType: ARCTYPE.ARCTYPE_CENTRE,
            centre: {
                position: {x: I, y: J},
                positionReference: POSITIONREFERENCE.RELATIVE // we don't support G91.1 right now
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

    private readonly buffer: ActivityStreamItem[]

    constructor(buffer) {
        super()
        this.buffer = buffer
    }

    post() {
        // here we want to simplify straight line segments
    }

    M2() {
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM
        })
    }

    M8() {
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM
        })
    }

    M200(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT,
            ...args(line),
            setDout: {
                doutToSet: U || 0,
                valueToSet: Boolean(V).valueOf() || false
            } as SetDoutCommand
        })
    }

    M201(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT,
            ...args(line),
            setAout: {
                aoutToSet: U || 0,
                valueToSet: Number(V).valueOf() || 0
            } as SetAoutCommand
        })
    }

    M202(params, line) {
        const { U, V } = params
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT,
            ...args(line),
            setIout: {
                ioutToSet: U || 0,
                valueToSet: Number(V).valueOf() || 0
            } as SetIoutCommand
        })
    }

    get positionReference() {
        return this.relative ? POSITIONREFERENCE.RELATIVE : POSITIONREFERENCE.ABSOLUTE
    }

    G0(params, line: GCodeLine) {
        // this.updateModals(params)

        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION,
            ...args(line),
            moveToPosition: {
                moveParams: { ...this.moveParams, blendType: BLENDTYPE.BLENDTYPE_NONE },
                cartesianPosition: {
                    configuration: 0, // not needed for cartesian machine
                    position: {
                        position: {
                            x: number_or_null(params.X),
                            y: number_or_null(params.Y),
                            z: number_or_null(params.Z)
                        },
                        positionReference: this.positionReference,
                        frameIndex: this.frameIndex
                    }
                }
            }
        })
    }

    G1(params, line: GCodeLine) {
        // this.updateModals(params)

        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
            ...args(line),
            moveLine: {
                moveParams: this.moveParams,
                line: {
                    position: {
                        x: number_or_null(params.X),
                        y: number_or_null(params.Y),
                        z: number_or_null(params.Z)
                    },
                    positionReference: this.positionReference,
                    frameIndex: this.frameIndex
                }
            }
        })
    }

    G2(params, line: GCodeLine) {
        // const start = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])
        // this.updateModals(params)
        // const end = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])

        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            ...args(line),
            moveArc: {
                moveParams: this.moveParams,
                ...arcParams(params, false, this.frameIndex, this.positionReference)
            }
        })
    }

    G3(params, line: GCodeLine) {
        // const start = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])
        // this.updateModals(params)
        // const end = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])

        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            ...args(line),
            moveArc: {
                moveParams: this.moveParams,
                ...arcParams(params, true, this.frameIndex, this.positionReference)
            }
        })
    }

    G4(params, line: GCodeLine) {
        this.buffer.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_DWELL,
            ...args(line),
            dwell: {
                ticksToDwell: params.P || 0
            }
        })
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

    G61() {
        // exact stop mode (the default)
        this.moveParams.blendType = BLENDTYPE.BLENDTYPE_NONE
    }

    G64() {
        this.moveParams.blendType = BLENDTYPE.BLENDTYPE_OVERLAPPED
        // TODO: this should be tolerance in overlapped scheme
        // moveParams.radius = params.P || 1e99; // big number meaning go as fast as possible!
    }
}
