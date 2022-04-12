import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("frames alt")

test.before.each(() => {
    gbc.reset("configs/frames_alt.json")

    // gbc.disable_limit_check()
    //
    // // move machine away from origin
    // gbc.set_joint_pos(0, 10)
    // gbc.set_joint_pos(1, 10)
    // gbc.set_joint_pos(2, 0)
    //
    gbc.enable_operation()
})

test("move_line with simple translation", async () => {
    // shouldn't really go anywhere because we are already at 10,0,0 in robot (kc) frame
    const move = gbc.wrap(gbc.activity.moveLine(10, 0, 0).frameIndex(0).promise)
    await move.start().iterations(10).assertCompleted()
    assertNear(0, 0, 0, 0, 0, 0)
})

export const frames_alt = test
