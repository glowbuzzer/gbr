/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ActivityController, CancelActivityBuilder } from "../api/builders"
import { ActivityStreamItem, MoveParametersConfig } from "../../gbc"
import { ActivityApiBaseWithPromises } from "../api/base"
import { ActivityApi } from "../api/interface"

/**
 * The GBR solo activity API (typically accessed using {@link useSoloActivity}) provides a convenient
 * way to send individual activities to GBC. The solo activity API is instantiated against a kinematics
 * configuration and has exclusive access to the motion of that KC. Attempting to execute a solo activity
 * while jogging or streaming (for example, GCode) will result in an error.
 *
 * Each method of the API returns a builder class that provides a fluent API with which you can further specify an activity.
 * After configuring the activity, call the `promise` method. This returns a promise which will be resolved when the activity completes,
 * allowing you to sequence multiple activities together.
 *
 * Each activity runs to completion unless cancelled or another activity is executed. If an activity
 * is running and another activity is issued, the first activity is cancelled and allowed to finish
 * gracefully before the new activity is started.
 *
 * Note that motion using the solo activity API is not blended (that is, absolute stop mode will be used).
 *
 * If you want to execute a series of moves, possibly with blending, you can stream activities using G-code.
 * Refer to the {@link useGCode} hook for more information.
 *
 * Example
 * ```jsx
 * const api=useSoloActivity(0) // instantiate API on first kinematics configuration
 * await api.moveArc(100,100,0) // initiate builder
 *          .centre(100, 0, 0)  // configure
 *          .direction(ARCDIRECTION.ARCDIRECTION_CW)
 *          .promise()          // execute and await
 * ```
 */
export class SoloActivityApi
    extends ActivityApiBaseWithPromises
    implements ActivityApi, ActivityController
{
    private readonly index: number
    private readonly _send: (msg: string) => void

    constructor(
        index: number,
        defaultMoveParameters: MoveParametersConfig,
        send: (msg: string) => void
    ) {
        super(index, defaultMoveParameters)
        this.index = index
        this._send = send
    }

    /** @ignore */
    get nextTag(): number {
        return this.currentTag++
    }

    /** @ignore */
    execute(command: ActivityStreamItem) {
        const soloActivity = JSON.stringify({
            command: {
                soloActivity: {
                    [this.index]: {
                        command
                    }
                }
            }
        })

        return this.createPromise(command.tag, () => this._send(soloActivity))
    }

    /** Cancel any currently executing activity */
    cancel() {
        return new CancelActivityBuilder(this)
    }
}
