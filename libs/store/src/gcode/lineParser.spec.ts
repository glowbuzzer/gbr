import { lineParser } from "./lineParser"

test("it should parse some lines", () => {
    const lines = Array.from(lineParser("a\nb\nc"))
    expect(lines.length).toBe(3)

    expect(lines[0].text).toEqual("a")
    expect(lines[0].startOffset).toBe(0)
    expect(lines[0].endOffset).toBe(1)

    expect(lines[1].text).toEqual("b")
    expect(lines[1].startOffset).toBe(2)
    expect(lines[1].endOffset).toBe(3)

    expect(lines[2].text).toEqual("c")
    expect(lines[2].startOffset).toBe(4)
    expect(lines[2].endOffset).toBe(5)
})
