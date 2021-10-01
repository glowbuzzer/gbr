import { GCodeSenderAdapter } from "./GCodeSenderAdapter"

function exec(gcode, tolerance = 0) {
    const buffer = []
    const adapter = new GCodeSenderAdapter(buffer, 100, tolerance)
    adapter.execute(gcode)
    return buffer
}

function last(v) {
    return v[v.length - 1].moveLine.line.position
}

describe("gcode sender adapter path simplification", () => {
    test("it should parse some gcode", () => {
        const buffer = exec(`
        G1 X10 Y10
    `)
        expect(buffer.length).toBe(1)
    })

    test("it should remove unnecessary moves", () => {
        const buffer = exec(`
        G1 X10 Y10
        G1 X11 Y10
        G1 X12 Y10`)

        expect(buffer.length).toBe(2)
        expect(last(buffer).x).toBe(12)
    })

    // TODO: ?: this doesn't work because simplify will always return the two endpoints even if they are within tolerance of each other
    test.skip("it should be able to reduce two moves to one", () => {
        const buffer = exec(
            `
                G91
                G1 X1
                G1 X0`,
            10000
        )

        expect(buffer.length).toBe(1)
        expect(last(buffer).x).toBe(0)
    })

    test("it cannot simplify if any unknowns", () => {
        const buffer = exec(
            `
        G1 X10
        G1 Y10
        G1 Z10
            `,
            1000000000000
        )

        expect(buffer.length).toBe(3)
        expect(last(buffer).x).toBe(10)
    })

    test("it can handle unknown after arc", () => {
        const buffer = exec(
            `
        G3 X1 Y1 I1
        G1 Y2
        G1 Y3
            `
        )

        expect(buffer.length).toBe(2)
        expect(last(buffer).x).toBe(1)
        expect(last(buffer).y).toBe(3)
    })

    test("it does not simplify arc/line/arc", () => {
        const buffer = exec(
            `
            G3 X1 Y1 I1
            G1 Y2
            G3 X0 Y3 I-1
            G1 Y1`,
            1000
        )

        expect(buffer.length).toBe(4)
        expect(last(buffer).x).toBe(0)
        expect(last(buffer).y).toBe(1)
    })

    test("it should handle missing axis values and end up at correct Z", () => {
        const buffer = exec(
            `
        G1 X10 Y10
        G1 X11 Y10 Z1 ; this should NOT be removed (unknown initial Z)
        G1 X12 Y10 ; this should be removed (Z is now known)
        G1 X13 Y10
    `,
            2
        )

        expect(buffer.length).toBe(3)

        expect(last(buffer).x).toBe(13)
        expect(last(buffer).z).toBe(1)
    })

    test("it should handle relative moves", () => {
        const buffer = exec(
            `
        G91
        G1 X10
        G1 X1 Y1 ; this can be removed
        G1 X1
        `,
            2
        )

        expect(buffer.length).toBe(2)

        expect(last(buffer).x).toBe(2)
        expect(last(buffer).y).toBe(1)
    })

    test("it should read Q setting for tolerance", () => {
        const buffer = exec(
            `
                G64 Q2
                G1 X0 Y0
                G1 X1 ; this can be removed
                G1 Y1 ; this can be removed
                G1 X2
            `
        )

        expect(buffer.length).toBe(2)

        expect(last(buffer).x).toBe(2)
        expect(last(buffer).y).toBe(1)
    })
})
