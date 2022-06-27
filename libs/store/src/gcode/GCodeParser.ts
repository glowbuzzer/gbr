/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/**
 * Code heavily adapted from https://github.com/cncjs/gcode-parser/blob/master/src/index.js
 */
import { lineParser } from "./lineParser"

const parseLine = (() => {
    // http://linuxcnc.org/docs/html/gcode/overview.html#gcode:comments
    // Comments can be embedded in a line using parentheses () or for the remainder of a lineusing a semi-colon. The semi-colon is not treated as the start of a comment when enclosed in parentheses.
    const stripComments = (() => {
        const re1 = new RegExp(/\s*\([^)]*\)/g) // Remove anything inside the parentheses
        const re2 = new RegExp(/\s*;.*/g) // Remove anything after a semi-colon to the end of the line, including preceding spaces
        const re3 = new RegExp(/\s+/g)
        return line => line.replace(re1, "").replace(re2, "").replace(re3, "")
    })()
    // noinspection RegExpUnnecessaryNonCapturingGroup
    const re = /(%.*)|({.*)|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9+\-.]+)|(\*[0-9]+)/gim

    return line => {
        const result = {
            line: line,
            words: [],
            ln: null
        }

        let ln // Line number
        // const regex = re.exec(line)
        const words = stripComments(line).match(re) || []

        for (let i = 0; i < words.length; ++i) {
            const word = words[i]
            const letter = word[0].toUpperCase()
            const argument = word.slice(1)

            // N: Line number
            if (letter === "N" && typeof ln === "undefined") {
                // Line (block) number in program
                ln = Number(argument)
                continue
            }

            let value = Number(argument)
            if (Number.isNaN(value)) {
                value = argument
            }

            result.words.push([letter, value])
        }

        // Line number
        typeof ln !== "undefined" && (result.ln = ln)

        return result
    }
})()

const parseStringSync = str => {
    const results = []
    const lines = Array.from(lineParser(str))

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
