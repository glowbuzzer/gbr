import GCodeInterpreter from "./GCodeInterpreter"
import { GCodeLine } from "./lineParser"
import {
    ActivityStreamItem,
    ACTIVITYTYPE,
    ARCDIRECTION,
    ARCTYPE,
    BLENDTYPE,
    CartesianPosition,
    MoveArcStream,
    POSITIONREFERENCE,
    SetAoutCommand,
    SetDoutCommand,
    SetIoutCommand
} from "../gbc"
import { simplify } from "./simplify"

// responsible for converting gcode to internal representation and doing buffered send to m4

function number_or_null(v) {
    return v === undefined ? null : Number(v)
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
        vmaxPercentage: 100, // this is the default, eg. for G0 without F param
        amaxPercentage: 100,
        jmaxPercentage: 100,
        blendType: 0,
        blendTimePercentage: 100
    }
    private frameIndex = 0
    private readonly buffer: (ActivityStreamItem & {
        canMergePrevious?: boolean
        simplifyTolerance: number
    })[]
    private readonly vmax: number
    private simplifyTolerance: number
    private vmaxPercentage = 100 // this will override moveParams above

    private canMergePrevious = false // determines if we are allowed to merge with previous

    constructor(buffer, vmax: number, simplifyTolerance = 0) {
        super()
        this.buffer = buffer
        this.vmax = vmax
        this.simplifyTolerance = simplifyTolerance
    }

    arcParams(params, ccw, frameIndex, positionReference): MoveArcStream {
        const I = params.I || 0
        const J = params.J || 0
        const R = params.R || 0

        const { x, y, z } = this.position

        const destination = {
            frameIndex,
            position: { x, y, z },
            positionReference
        }

        const arcDirection = ccw ? ARCDIRECTION.ARCDIRECTION_CCW : ARCDIRECTION.ARCDIRECTION_CW

        if (Math.abs(R) > 0) {
            return {
                arc: {
                    destination,
                    arcType: ARCTYPE.ARCTYPE_RADIUS,
                    radius: { value: R },
                    arcDirection
                }
            }
        }

        return {
            arc: {
                destination,
                arcType: ARCTYPE.ARCTYPE_CENTRE,
                centre: {
                    position: { x: I, y: J },
                    positionReference: POSITIONREFERENCE.RELATIVE // we don't support G91.1 right now
                }
            }
        }
    }

    push(primitive) {
        this.buffer.push({
            ...primitive,
            canMergePrevious:
                this.canMergePrevious &&
                primitive.activityType === ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
            simplifyTolerance: this.simplifyTolerance
        })
    }

    command(handled, cmd, args, data) {
        const vmax_changed = args.F && this.convertVmaxPercentage(args.F) !== this.vmaxPercentage
        const supported_move = cmd === "G1" || cmd === "G2" || cmd === "G3"
        this.canMergePrevious = supported_move && !vmax_changed
    }

    post() {
        function make_abs_adapter() {
            let tracker = { x: null, y: null, z: null }
            return {
                in(p) {
                    // map function that replaces null where possible in the input with absolute positions
                    tracker = {
                        // these may remain null for entire sequence, eg. if no Z specified anywhere
                        x: p.x === null ? tracker.x : p.x,
                        y: p.y === null ? tracker.y : p.y,
                        z: p.z == null ? tracker.z : p.z
                    }
                    return { ...tracker }
                },
                out(p) {
                    // we leave the absolute positions filled in because we might as well (where known)
                    return p
                }
            }
        }

        function make_rel_adapter(initial_position) {
            let tracker = { x: 0, y: 0, z: 0 }
            return {
                in(p) {
                    // sum all the relative moves starting at zero to give absolute moves (possibly offset from real origin)
                    tracker = {
                        x: p.x === null ? tracker.x : tracker.x + p.x,
                        y: p.y === null ? tracker.y : tracker.y + p.y,
                        z: p.z == null ? tracker.z : tracker.z + p.z
                    }
                    return { ...tracker }
                },
                out(p, index, arr) {
                    // convert absolute back to relative
                    const prev = index === 0 ? initial_position : arr[index - 1]
                    return {
                        x: p.x - prev.x,
                        y: p.y - prev.y,
                        z: p.z - prev.z
                    }
                }
            }
        }

        function cartesian_position(activity: ActivityStreamItem): CartesianPosition {
            switch (activity.activityType) {
                case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
                    return activity.moveLine.line

                case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
                    return activity.moveArc.arc.destination

                default:
                    throw new Error("Unexpected activity type: " + activity.activityType)
            }
        }

        // here we want to simplify straight line segments
        for (let n = 0; n < this.buffer.length; n++) {
            let merge = 0
            while (this.buffer[n + merge + 1]?.canMergePrevious) {
                merge++
            }
            if (merge) {
                const sub = this.buffer.slice(n, n + merge + 1)

                const target = cartesian_position(sub[0])
                const absRel = target.positionReference
                const adapter =
                    absRel === POSITIONREFERENCE.ABSOLUTE
                        ? make_abs_adapter()
                        : make_rel_adapter(target.position)

                // here we map activities to simple target points
                const tolerance = sub[0].simplifyTolerance
                const simplify_result = simplify(
                    sub.map(p => cartesian_position(p).position).map(adapter.in),
                    tolerance,
                    false
                )
                // we want to discard first point of sequence and leave activity unaltered (could be arc, etc)
                const lines = simplify_result.slice(1)
                const template = sub[1] // this is the first line
                const activities = [
                    sub[0], // this is first activity unaltered
                    // for the rest (all move lines), use adapter out function then
                    // map to new activity using point as target
                    ...lines.map(adapter.out).map(p => {
                        return {
                            ...template,
                            moveLine: {
                                ...template.moveLine,
                                line: {
                                    ...template.moveLine.line,
                                    position: {
                                        ...template.moveLine.line.position,
                                        ...p
                                    }
                                }
                            }
                        }
                    })
                ]

                // now splice into main buffer and continue
                this.buffer.splice(n, merge + 1, ...activities)
                n += merge
            }
        }
        this.buffer.forEach(item => {
            // remove properties that are not part of stream item
            delete item.canMergePrevious
            delete item.simplifyTolerance
        })
    }

    M2() {
        this.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM
        })
    }

    M8() {
        this.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM
        })
    }

    M200(params, line) {
        const { U, V } = params
        this.push({
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
        this.push({
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
        this.push({
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
        const position = {
            position: this.position,
            positionReference: this.positionReference,
            frameIndex: this.frameIndex
        }
        if (params.F) {
            // turn this into a linear move_line
            const vmaxPercentage = Math.ceil((params.F / this.vmax) * 100)
            this.push({
                activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
                ...args(line),
                moveLine: {
                    moveParams: {
                        ...this.moveParams,
                        vmaxPercentage,
                        blendType: BLENDTYPE.BLENDTYPE_NONE
                    },
                    line: position
                }
            })
        } else {
            // use basic move_to_position using full joint limits
            this.push({
                activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION,
                ...args(line),
                moveToPosition: {
                    moveParams: {
                        ...this.moveParams,
                        blendType: BLENDTYPE.BLENDTYPE_NONE
                    },
                    cartesianPosition: {
                        configuration: 0, // TODO: think about how to specify in robot land
                        position: position
                    }
                }
            })
        }
    }

    G1(params, line: GCodeLine) {
        this.updateVmax(params)

        this.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
            ...args(line),
            moveLine: {
                moveParams: { ...this.moveParams, vmaxPercentage: this.vmaxPercentage },
                line: {
                    position: this.position,
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

        this.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            ...args(line),
            moveArc: {
                moveParams: { ...this.moveParams, vmaxPercentage: this.vmaxPercentage },
                ...this.arcParams(params, false, this.frameIndex, this.positionReference)
            }
        })
    }

    G3(params, line: GCodeLine) {
        // const start = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])
        // this.updateModals(params)
        // const end = new Vector3(this.current_positions[0], this.current_positions[1], this.current_positions[2])

        this.push({
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            ...args(line),
            moveArc: {
                moveParams: { ...this.moveParams, vmaxPercentage: this.vmaxPercentage },
                ...this.arcParams(params, true, this.frameIndex, this.positionReference)
            }
        })
    }

    G4(params, line: GCodeLine) {
        this.push({
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

    G64(params) {
        this.moveParams.blendType = BLENDTYPE.BLENDTYPE_OVERLAPPED
        this.simplifyTolerance = params.Q || 0
        // TODO: this should be tolerance in overlapped scheme
        // moveParams.radius = params.P || 1e99; // big number meaning go as fast as possible!
    }

    private convertVmaxPercentage(value) {
        return Math.ceil((value / this.vmax) * 100)
    }

    private setVmaxPercentage(value) {
        this.vmaxPercentage = this.convertVmaxPercentage(value)
    }

    F(value) {
        this.setVmaxPercentage(value)
    }

    private updateVmax(params) {
        if (params.F) {
            this.setVmaxPercentage(params.F)
        }
    }
}
