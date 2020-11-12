import GCodeInterpreter from "../gcode/GCodeInterpreter"
import { Vector3 } from "three"

function toVector3(vals: number[]) {
    return new Vector3(...vals)
}

export class GCodePreviewAdapter extends GCodeInterpreter {
    readonly segments: GCodeSegment[] = []

    constructor(current_positions) {
        super((cmd, params) => {
            // console.log("Unhandled gcode: ", cmd, params)
        }, current_positions)
    }

    G0(params) {
        const [from, to] = this.updateModals(params).map(toVector3)
        this.segments.push({
            from,
            to,
            color: 0
        })
    }

    G1(params) {
        this.updateModals(params)
    }

    G2(params) {}

    G3(params) {}

    G61() {}

    G64() {}
}
