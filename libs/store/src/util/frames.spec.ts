/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { build_tree2 } from "./frame_utils"

describe("frames", () => {
    it("should handle forward refs by child frames", () => {
        const tree = build_tree2([
            {
                name: "f1",
                translation: {
                    x: 10
                }
            },
            {
                name: "f2",
                positionReference: 1,
                parentFrameIndex: 2,
                translation: {
                    x: 5
                }
            },
            {
                name: "f3",
                translation: {
                    x: 20
                }
            }
        ])
        expect(tree.length).toBe(2) // 2 root frames
        expect(tree[0].name).toBe("f1")
        expect(tree[1].name).toBe("f3")
        expect(tree[1].children.length).toBe(1)

        const child = tree[1].children[0]
        expect(child.name).toBe("f2")
        expect(child.relative.translation.x).toBe(5)
        expect(child.absolute.translation.x).toBe(25)
    })
})
