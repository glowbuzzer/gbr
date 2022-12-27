/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { parseStringSync } from "./GCodeParser"
import { CartesianPosition, POSITIONREFERENCE } from "../gbc"

/**
 * Code heavily adapted from https://github.com/cncjs/gcode-interpreter/blob/master/src/Interpreter.js
 */

/**
 * Returns an object composed of arrays of property names and values.
 * @example
 *   fromPairs([['a', 1], ['b', 2]]);
 *   // => { 'a': 1, 'b': 2 }
 */
const fromPairs = pairs => {
    let index = -1
    const length = !pairs ? 0 : pairs.length
    const result = {}

    while (++index < length) {
        const pair = pairs[index]
        result[pair[0]] = pair[1]
    }

    return result
}

const partitionWordsByGroup = (words = []) => {
    const groups: unknown[][] = []

    for (let i = 0; i < words.length; ++i) {
        const word = words[i]
        const letter = word[0]

        if (letter === "G" || letter === "M" || letter === "T") {
            groups.push([word])
            continue
        }

        if (groups.length > 0) {
            groups[groups.length - 1].push(word)
        } else {
            groups.push([word])
        }
    }

    return groups
}

const gcode_axes = ["X", "Y", "Z"] // case-sensitive as found in gcode, eg. G0 X100

class GCodeInterpreter {
    private readonly cartesianPosition: CartesianPosition
    private readonly workspaceFrames: Record<number, number | null>
    protected unitConversion = 1
    private motionMode = "G0"
    private previousPosition: CartesianPosition

    constructor(
        cartesianPosition: CartesianPosition,
        workspaceFrames: Record<number, number | null>
    ) {
        this.previousPosition = cartesianPosition
        this.cartesianPosition = cartesianPosition
        this.workspaceFrames = workspaceFrames
    }

    get position(): CartesianPosition {
        return { ...this.cartesianPosition }
    }

    interpret(data) {
        const groups = partitionWordsByGroup(data.words)

        for (let i = 0; i < groups.length; ++i) {
            const words = groups[i]
            const word = words[0] || []
            const letter = word[0]
            const code = word[1]
            let cmd = ""
            let args = {}

            if (letter === "G") {
                cmd = "" + letter + code
                args = fromPairs(words.slice(1))

                // Motion Mode
                if (
                    code === 0 ||
                    code === 1 ||
                    code === 2 ||
                    code === 3 ||
                    code === 38.2 ||
                    code === 38.3 ||
                    code === 38.4 ||
                    code === 38.5
                ) {
                    this.motionMode = cmd
                } else if (code === 90 /* absolute */) {
                    this.cartesianPosition.positionReference = POSITIONREFERENCE.ABSOLUTE
                } else if (code === 91 /* relative */) {
                    this.cartesianPosition.positionReference = POSITIONREFERENCE.RELATIVE
                } else if (code === 80) {
                    this.motionMode = ""
                }
            } else if (letter === "M") {
                cmd = "" + letter + code
                args = fromPairs(words.slice(1))
            } else if (letter === "T") {
                // T1 ; w/o M6
                cmd = letter
                args = code
            } else if (letter === "F") {
                // F750 ; w/o motion command
                cmd = letter
                args = code
            } else if (letter === "S") {
                // S without motion command
                cmd = letter
                args = code
            } else if ("XYZABCIJK".indexOf(letter) >= 0) {
                // Use previous motion command if the line does not start with G-code or M-code.
                // @example
                //   G0 Z0.25
                //   X-0.5 Y0.
                //   Z0.1
                //   G01 Z0. F5.
                //   G2 X0.5 Y0. I0. J-0.5
                //   X0. Y-0.5 I-0.5 J0.
                //   X-0.5 Y0. I0. J0.5
                // @example
                //   G01
                //   M03 S0
                //   X5.2 Y0.2 M03 S0
                //   X5.3 Y0.1 M03 S1000
                //   X5.4 Y0 M03 S0
                //   X5.5 Y0 M03 S0
                cmd = this.motionMode
                args = fromPairs(words)
            }

            if (!cmd) {
                continue
            }

            const [current_position, target_position] = this.updatePositions(args)
            if (typeof this[cmd] === "function") {
                const func = this[cmd].bind(this)
                func(args, data, current_position, target_position)
                this.command(true, cmd, args, data, current_position, target_position)
            } else {
                this.command(false, cmd, args, data, current_position, target_position)
            }
        }
    }

    G20() {
        // imperial units
        this.unitConversion = 2.54
    }

    G21() {
        // metric units
        this.unitConversion = 1
    }

    private set_frame_index(workspaceOffsetIndex: number) {
        const frameIndex = this.workspaceFrames[workspaceOffsetIndex]
        if (frameIndex !== null) {
            this.cartesianPosition.frameIndex = frameIndex
        }
    }

    G54() {
        this.set_frame_index(1)
    }

    G55() {
        this.set_frame_index(2)
    }

    G56() {
        this.set_frame_index(3)
    }

    G57() {
        this.set_frame_index(4)
    }

    G58() {
        this.set_frame_index(5)
    }

    G59() {
        this.set_frame_index(6)
    }

    command(handled, cmd, args, data, current_position, target_position) {
        // override to inspect all commands
    }

    post() {
        // override to provide postprocessing logic
    }

    execute(str) {
        const list = parseStringSync(str)
        for (let i = 0; i < list.length; ++i) {
            this.interpret(list[i])
        }
        this.post()
    }

    protected shiftPositions(prev: CartesianPosition, next: CartesianPosition) {
        // gbc handles all relative moves so there is nothing to do here
        return [{ ...prev }, { ...next }]
    }

    private updatePositions(params) {
        if (this.cartesianPosition.positionReference === POSITIONREFERENCE.RELATIVE) {
            this.cartesianPosition.translation = { x: 0, y: 0, z: 0 }
        } else {
            // clone position before modification
            this.cartesianPosition.translation = { ...this.cartesianPosition.translation }
        }
        Object.keys(params).forEach(k => {
            if (gcode_axes.includes(k)) {
                this.cartesianPosition.translation[k.toLowerCase()] =
                    params[k] * this.unitConversion
            }
        })
        // this is handled differently by preview adapter
        const [prev, next] = this.shiftPositions(this.previousPosition, this.cartesianPosition)
        this.previousPosition = next // for next iteration
        return [prev, next]
    }
}

export default GCodeInterpreter
