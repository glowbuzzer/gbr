import GCodeInterpreter from "./GCodeInterpreter"
import { GCodeLine } from "./lineParser"
import {
    ActivityStreamItem,
    ACTIVITYTYPE,
    ARCDIRECTION,
    BLENDTYPE,
    CartesianPosition,
    LIMITPROFILE,
    POSITIONREFERENCE,
    SPINDLEDIRECTION
} from "../gbc"
import { simplify } from "./simplify"
import { GCodeContextType } from "./index"
import { GCodeActivityProvider } from "../activity/GCodeActivityProvider"
import { MoveArcBuilder } from "../activity"

// responsible for converting gcode to internal representation and doing buffered send to m4

// noinspection JSUnusedGlobalSymbols
export class GCodeSenderAdapter extends GCodeInterpreter {
    // default move params
    private moveParams = {
        vmaxPercentage: 100, // this is the default, full speed
        amaxPercentage: 100,
        jmaxPercentage: 100,
        blendType: 0,
        blendTimePercentage: 100
    }
    // private frameIndex = 0
    private readonly buffer: (ActivityStreamItem & {
        canMergePrevious?: boolean
        simplifyTolerance: number
    })[]
    private readonly vmax: number
    private simplifyTolerance: number
    private vmaxPercentage = 100 // this will override moveParams above

    private canMergePrevious = false // determines if we are allowed to merge with previous
    private readonly context: GCodeContextType
    private toolIndex = 0
    private previousToolIndex = 0
    private readonly api: GCodeActivityProvider
    private spindleSpeed: number

    constructor(buffer, vmax: number, context?: GCodeContextType, simplifyTolerance = 0) {
        super({
            translation: { x: null, y: null, z: null },
            positionReference: POSITIONREFERENCE.ABSOLUTE,
            frameIndex: 0
        })
        this.api = new GCodeActivityProvider(0 /* TODO: allow different kcs */, this.buffer)
        this.buffer = buffer
        this.vmax = vmax
        this.context = context
        this.simplifyTolerance = simplifyTolerance
    }

    arcActivity(lineNum: number, params, ccw: boolean): MoveArcBuilder {
        const I = params.I * this.unitConversion || 0
        const J = params.J * this.unitConversion || 0
        const R = params.R * this.unitConversion || 0

        const arcDirection = ccw ? ARCDIRECTION.ARCDIRECTION_CCW : ARCDIRECTION.ARCDIRECTION_CW

        if (Math.abs(R) > 0) {
            return this.api
                .setTag(lineNum)
                .moveArc()
                .setFromCartesianPosition(this.position)
                .radius(R)
                .direction(arcDirection)
                .params({
                    ...this.moveParams,
                    vmaxPercentage: this.vmaxPercentage
                })
        }

        return this.api
            .setTag(lineNum)
            .moveArc()
            .setFromCartesianPosition(this.position)
            .centre(I, J, null, POSITIONREFERENCE.RELATIVE)
            .direction(arcDirection)
            .params({
                ...this.moveParams,
                vmaxPercentage: this.vmaxPercentage
            })
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
                        : make_rel_adapter(target.translation)

                // here we map activities to simple target points
                const tolerance = sub[0].simplifyTolerance
                const points = sub.map(p => cartesian_position(p).translation).map(adapter.in)
                const simplify_result = simplify(points, tolerance)

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
                                    translation: {
                                        ...template.moveLine.line.translation,
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

    M0(params, { lineNum }: GCodeLine) {
        this.push(this.api.setTag(lineNum).pauseProgram().command)
    }

    T(params) {
        this.previousToolIndex = this.toolIndex
        this.toolIndex = Number(params)
    }

    M2(params, line: GCodeLine) {
        this.push(this.api.setTag(line.lineNum).endProgram().command)
    }

    M3(params, line: GCodeLine) {
        this.S(params.S) // modal S code
        this.push(
            this.api
                .setTag(line.lineNum)
                .spindle(0, true, this.spindleSpeed, SPINDLEDIRECTION.SPINDLEDIRECTION_CW).command
        )
    }

    M4(params, line: GCodeLine) {
        this.S(params.S) // modal S code
        this.push(
            this.api
                .setTag(line.lineNum)
                .spindle(0, true, this.spindleSpeed, SPINDLEDIRECTION.SPINDLEDIRECTION_CCW).command
        )
    }

    M5(params, line: GCodeLine) {
        this.S(params.S) // modal S code
        this.push(this.api.setTag(line.lineNum).spindle(0, false).command)
    }

    M6(params, line: GCodeLine) {
        this.api.setTag(line.lineNum)
        // tool change
        if (this.context) {
            // hard coded to first KC for now
            const builders = this.context.handleToolChange(
                0,
                this.previousToolIndex,
                this.toolIndex,
                this.api
            )
            // builder promises will append activities to the buffer
            builders?.forEach(b => b.promise())
        } else {
            // tool offset is handled by G43
        }
    }

    M8(params, line: GCodeLine) {
        this.push(this.api.setTag(line.lineNum).endProgram().command)

        // this.push({
        //     activityType: ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM
        // })
    }

    M200(params, line: GCodeLine) {
        const { U, V } = params
        this.push(
            this.api.setTag(line.lineNum).setDout(U || 0, Boolean(V).valueOf() || false).command
        )
    }

    M201(params, line: GCodeLine) {
        const { U, V } = params
        this.push(this.api.setTag(line.lineNum).setAout(U || 0, Number(V).valueOf() || 0).command)
    }

    M202(params, line: GCodeLine) {
        const { U, V } = params
        this.push(this.api.setTag(line.lineNum).setIout(U || 0, Number(V).valueOf() || 0).command)
    }

    G0(params, line: GCodeLine) {
        // this.updateModals(params)
        this.api.setTag(line.lineNum)
        // for now we treat rapids as a linear move but with a different limit profile
        // (if specified, otherwise gbc will default to regular limits)
        // F param is ignored
        this.push(
            this.api
                .moveLine()
                .setFromCartesianPosition(this.position)
                .params({
                    ...this.moveParams,
                    limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_RAPIDS,
                    blendType: BLENDTYPE.BLENDTYPE_NONE
                }).command
        )

        // if (params.F) {
        //     // turn this into a linear move_line
        //     const vmaxPercentage = Math.ceil((params.F / this.vmax) * 100)
        //     this.push(
        //         this.api
        //             .moveLine()
        //             .setFromCartesianPosition(this.position)
        //             .params({
        //                 ...this.moveParams,
        //                 vmaxPercentage,
        //                 blendType: BLENDTYPE.BLENDTYPE_NONE
        //             }).command
        //     )
        // } else {
        //     // use basic move_to_position using full joint limits
        //     this.push(
        //         this.api
        //             .moveToPosition()
        //             .setFromCartesianPosition(this.position)
        //             .configuration(0)
        //             .params({
        //                 ...this.moveParams,
        //                 limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_RAPIDS,
        //                 blendType: BLENDTYPE.BLENDTYPE_NONE
        //             }).command
        //     )
        // }
    }

    G1(params, line: GCodeLine) {
        this.updateVmax(params)

        this.F(params.F)
        this.push(
            this.api
                .setTag(line.lineNum)
                .moveLine()
                .setFromCartesianPosition(this.position)
                .params({
                    ...this.moveParams,
                    vmaxPercentage: this.vmaxPercentage
                }).command
        )
    }

    G2(params, line: GCodeLine) {
        this.F(params.F)
        this.push(this.arcActivity(line.lineNum, params, false).command)
    }

    G3(params, line: GCodeLine) {
        this.F(params.F)
        this.push(this.arcActivity(line.lineNum, params, true).command)
    }

    G4(params, line: GCodeLine) {
        this.push(this.api.setTag(line.lineNum).dwell(params.P || 0).command)
    }

    G43(params, line: GCodeLine) {
        this.push(this.api.setTag(line.lineNum).setToolOffset(params.H).command)
    }

    G49(params, line: GCodeLine) {
        this.push(this.api.setTag(line.lineNum).setToolOffset(params.H).command)
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

    F(value) {
        if (value) {
            this.setVmaxPercentage(value)
        }
    }

    S(value) {
        if (value) {
            console.log("SET SPINDLE SPEED!!", value)
            this.spindleSpeed = value
        }
    }

    private convertVmaxPercentage(value) {
        return Math.ceil((value / this.vmax) * 100)
    }

    private setVmaxPercentage(value) {
        this.vmaxPercentage = this.convertVmaxPercentage(value)
    }

    private updateVmax(params) {
        if (params.F) {
            this.setVmaxPercentage(params.F)
        }
    }
}
