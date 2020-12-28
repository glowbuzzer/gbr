import { parseStringSync } from "./GCodeParser"

/**
 * Returns an object composed from arrays of property names and values.
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
    const groups = []

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

function update_axis(axis, value, current_positions) {
    const index = gcode_axes.indexOf(axis)
    if (index < 0) {
        return
    }
    current_positions[index] = value
}

class GCodeInterpreter {
    private motionMode = "G0"
    protected readonly current_positions: number[]

    constructor(current_positions: number[]) {
        this.current_positions = current_positions
    }

    protected updateModals(params) {
        const prev = [...this.current_positions]
        Object.keys(params).forEach(k => update_axis(k, params[k], this.current_positions))
        // console.log("FROM", prev, "TO", this.current_positions)
        return [prev, [...this.current_positions]]
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
                cmd = letter + code
                args = fromPairs(words.slice(1))

                // Motion Mode
                if (code === 0 || code === 1 || code === 2 || code === 3 || code === 38.2 || code === 38.3 || code === 38.4 || code === 38.5) {
                    this.motionMode = cmd
                } else if (code === 80) {
                    this.motionMode = ""
                }
            } else if (letter === "M") {
                cmd = letter + code
                args = fromPairs(words.slice(1))
            } else if (letter === "T") {
                // T1 ; w/o M6
                cmd = letter
                args = code
            } else if (letter === "F") {
                // F750 ; w/o motion command
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

            // if (typeof this.handlers[cmd] === "function") {
            //     const func = this.handlers[cmd]
            //     func(args)
            // } else if (typeof this.defaultHandler === "function") {
            //     this.defaultHandler(cmd, args)
            // }

            if (typeof this[cmd] === "function") {
                const func = this[cmd].bind(this)
                func(args, data)
            }
        }
    }

    execute(str) {
        const list = parseStringSync(str)
        for (let i = 0; i < list.length; ++i) {
            this.interpret(list[i])
        }
    }
}

export default GCodeInterpreter
