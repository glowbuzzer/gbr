export type GCodeLine = {
    lineNum: number
    startOffset: number
    endOffset: number
    text: string
}

export function* lineParser(input: string): IterableIterator<GCodeLine> {
    let startOffset = 0
    let lineNum = 0
    while (startOffset < input.length) {
        let endOffset = input.indexOf("\n", startOffset)
        if (endOffset < 0) {
            endOffset = input.length
        }
        yield {
            lineNum,
            startOffset,
            endOffset,
            text: input.substr(startOffset, endOffset - startOffset)
        }
        lineNum++
        startOffset = endOffset + 1
    }
}
