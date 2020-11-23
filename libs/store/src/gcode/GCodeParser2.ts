/**
 * THIS IS UNFINISHED, TURNS OUT WE DON'T NEED CHAR OFFSETS INTO GCODE AS IT'S MORE COMPLICATED AND LINE-BASED BLOCK IS BEST WE CAN DO
 */

class ParserError extends Error {
    private at: number

    constructor(message: string, at: number) {
        super(message)
        this.at = at
    }
}

type GCodeWord = {
    start: number
    end: number
}

type GCodeComment = {
    start: number
    end: number
    text: string
}

type GCodeLineNum = {
    start: number
    end: number
    lineNum: number
}

type GCodeBlockItemType = "word" | "comment" | "lineNum"

type GCodeBlockItem = {
    type: GCodeBlockItemType
    start: number
    end: number
}

type GCodeBlock = {
    lineNum: number
    items: GCodeBlockItem[]
}

export function* parseGCode(text: string): IterableIterator<GCodeBlock> {
    let at = 0
    let ch = " "

    const error = message => {
        throw new ParserError(message, at)
    }

    const next = function (c?) {
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'")
        }

        ch = text.charAt(at)
        at += 1
        return ch
    }

    const number = function () {
        if (ch === "-") {
            next("-")
        }
        while (ch >= "0" && ch <= "9") {
            next()
        }
        if (ch === ".") {
            // noinspection StatementWithEmptyBodyJS
            while (next() && ch >= "0" && ch <= "9");
        }
        if (ch === "e" || ch === "E") {
            next()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (ch === "-" || ch === "+") {
                next()
            }
            while (ch >= "0" && ch <= "9") {
                next()
            }
        }
    }

    const ignore_whitespace = function () {
        // we consider tabs, spaces and line feed to be whitespace (we use newline \n for line breaks)
        while (ch && (ch === " " || ch === "\t" || ch === "\r")) {
            next()
        }
    }

    const comment_to_eol = function () {
        while (ch && ch !== "\n") {
            next()
        }
    }

    const comment_to_close = function () {
        while (ch && ch !== ")") {
            next()
        }
        next() // move past closing ')'
    }

    const gcode = function () {
        next() // consume single-letter code
        number() // consume number param
    }

    function emit(type: GCodeBlockItemType, fn) {
        const start = at - 1 // 'at' is always one ahead of actual ptr
        fn()
        const end = at - 1
        return {
            type,
            start,
            end
        }
    }

    const items: GCodeBlockItem[] = []
    let lineNum = 0

    while (ch) {
        ignore_whitespace()
        if (!ch) {
            break
        }
        if (ch === "\n") {
            yield {
                lineNum: lineNum++,
                items: [...items.splice(0)]
            }
        }
        if (ch === ";") {
            items.push(emit("comment", comment_to_eol))
        } else if (ch === "(") {
            items.push(emit("comment", comment_to_close))
        } else if (ch >= "A" && ch <= "z") {
            if (ch.toUpperCase() === "N") {
                items.push(emit("lineNum", gcode))
            } else {
                items.push(emit("word", gcode))
            }
        } else {
            error("Unrecognised char: " + ch)
            next()
        }
    }
}

type GCodeGroup = {
    start: number
    end: number
    command: string
    params: { [index: string]: number }
}

type GCodeContext = {
    modal_g: number[][]
    modal_m: number[][]
    non_modal: number[][]
}

export function* groupGCode(gcode: string, context: GCodeContext, iter: IterableIterator<GCodeBlock>): IterableIterator<GCodeGroup> {
    const buffer: GCodeWord[] = []

    function extract(event: GCodeWord): string {
        return gcode.substr(event.start, event.end - event.start)
    }

    function convert_buffer() {
        const events = buffer.splice(0) // remove all events from buffer
        const start = events[0].start // start index for group
        const end = events[events.length - 1].end // end index for group
        const command = extract(events[0]) // this is the command, eg. G1
        const params = events.slice(1).reduce((agg, next) => {
            // convert to name/value pairs
            const param = extract(next)
            const code = param.charAt(0)
            agg[code] = Number(param.slice(1))
            return agg
        }, {})

        return {
            start,
            end,
            command,
            params
        }
    }

    // for (const event of iter) {
    //     if (event. !== "gcode") {
    //         // ignore all comments, etc
    //         continue
    //     }
    //     const code = gcode.charAt(event.start)
    //     if ("GMT".indexOf(code) >= 0) {
    //         // these are the codes that initiate a new group
    //         if (buffer.length) {
    //             yield convert_buffer()
    //         }
    //     }
    //     buffer.push(event)
    // }

    if (buffer.length) {
        // make sure we emit any trailing group
        yield convert_buffer()
    }
}
