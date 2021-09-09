// @param {string} line The G-code line
import { lineParser } from "./lineParser"

const parseLine = (() => {
    // http://reprap.org/wiki/G-code#Special_fields
    // The checksum "cs" for a GCode string "cmd" (including its line number) is computed
    // by exor-ing the bytes in the string up to and not including the * character.
    // const computeChecksum = s => {
    //     s = s || ""
    //     if (s.lastIndexOf("*") >= 0) {
    //         s = s.substr(0, s.lastIndexOf("*"))
    //     }
    //
    //     let cs = 0
    //     for (let i = 0; i < s.length; ++i) {
    //         const c = s[i].charCodeAt(0)
    //         cs ^= c
    //     }
    //     return cs
    // }

    // http://linuxcnc.org/docs/html/gcode/overview.html#gcode:comments
    // Comments can be embedded in a line using parentheses () or for the remainder of a lineusing a semi-colon. The semi-colon is not treated as the start of a comment when enclosed in parentheses.
    const stripComments = (() => {
        const re1 = new RegExp(/\s*\([^)]*\)/g) // Remove anything inside the parentheses
        const re2 = new RegExp(/\s*;.*/g) // Remove anything after a semi-colon to the end of the line, including preceding spaces
        const re3 = new RegExp(/\s+/g)
        return line => line.replace(re1, "").replace(re2, "").replace(re3, "")
    })()
    const re = /(%.*)|({.*)|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9+\-.]+)|(\*[0-9]+)/gim

    return line => {
        const result = {
            line: line,
            words: [] as any[],
            ln: null
        }

        // result.words = []

        let ln // Line number
        // const regex = re.exec(line)
        const words = stripComments(line).match(re) || []

        for (let i = 0; i < words.length; ++i) {
            const word = words[i]
            const letter = word[0].toUpperCase()
            const argument = word.slice(1)

            // Parse % commands for bCNC and CNCjs
            // - %wait Wait until the planner queue is empty
            // if (letter === "%") {
            //     result.cmds = (result.cmds || []).concat(line.trim())
            //     continue
            // }

            // Parse JSON commands for TinyG and g2core
            // if (letter === "{") {
            //     result.cmds = (result.cmds || []).concat(line.trim())
            //     continue
            // }

            // Parse $ commands for Grbl
            // - $C Check gcode mode
            // - $H Run homing cycle
            // if (letter === "$") {
            //     result.cmds = (result.cmds || []).concat(`${letter}${argument}`)
            //     continue
            // }

            // N: Line number
            if (letter === "N" && typeof ln === "undefined") {
                // Line (block) number in program
                ln = Number(argument)
                continue
            }

            // *: Checksum
            // TODO: ?: put checksum back in
            // if (letter === "*" && typeof cs === "undefined") {
            //     cs = Number(argument)
            //     continue
            // }

            let value = Number(argument)
            if (Number.isNaN(value)) {
                value = argument
            }

            result.words.push([letter, value])
        }

        // Line number
        typeof ln !== "undefined" && (result.ln = ln)

        // Checksum
        // typeof cs !== "undefined" && (result.cs = cs)
        // if (result.cs && computeChecksum(line) !== result.cs) {
        //     result.err = true // checksum failed
        // }

        return result
    }
})()

const parseStringSync = str => {
    const results:any[] = []
    const lines = Array.from(lineParser(str)) // str.split("\n")

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i].text.trim()
        if (line.length === 0) {
            continue
        }
        const result = parseLine(line)
        results.push({
            ...result,
            ...lines[i]
        })
    }

    return results
}

export { parseStringSync }
