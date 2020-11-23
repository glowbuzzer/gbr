import { groupGCode, parseGCode } from "./GCodeParser2"

test("it should parse gcode", () => {
    const gcode = `
        G1 X100 Y100.54
        ; this is a comment
        (this is a comment) G0 X5
        G2 X400 Z0 ; this is a comment
    `
    for (const e of parseGCode(gcode)) {
        console.log("Got event", e)
    }
})

test("it should not emit whitespace 1", () => {
    const gcode = `
        ; comment
        G1
    `
    const events = Array.from(parseGCode(gcode))
    expect(events.length).toBe(2)
})

test("it should not emit whitespace 2", () => {
    const gcode = `
        (comment)
        G1
    `
    const events = Array.from(parseGCode(gcode))
    expect(events.length).toBe(2)
})

test("it should group commands", () => {
    const gcode = `
        (comment)
        G1 X100 Y100
    `

    const groups = Array.from(groupGCode(gcode, parseGCode(gcode)))
    expect(groups.length).toBe(1)
    console.log(groups)
})
