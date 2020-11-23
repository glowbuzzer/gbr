/**
 * THIS IS UNFINISHED, TURNS OUT WE DON'T NEED CHAR OFFSETS INTO GCODE AS IT'S MORE COMPLICATED AND LINE-BASED BLOCK IS BEST WE CAN DO
 */

const gcode_axes = ["X", "Y", "Z"] // case-sensitive as found in gcode, eg. G0 X100

function update_axis(axis, value, current_positions) {
    const index = gcode_axes.indexOf(axis)
    if (index < 0) {
        return
    }
    current_positions[index] = value
}

export abstract class GCodeInterpreter2 {
    private motionMode = "G0"
    protected readonly current_positions: number[]

    protected constructor(current_positions: number[]) {
        this.current_positions = current_positions
    }

    protected updateModals(params) {
        const prev = [...this.current_positions]
        Object.keys(params).forEach(k => update_axis(k, params[k], this.current_positions))
        // console.log("FROM", prev, "TO", this.current_positions)
        return [prev, [...this.current_positions]]
    }

    execute(gcode: string) {
        // for (const group of groupGCode(gcode, parseGCode(gcode))) {
        // }
    }
}
