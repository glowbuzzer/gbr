/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    ActivityApi,
    ActivityController,
    EndProgramBuilder,
    PauseProgramBuilder
} from "../activity"
import {
    ActivityApiBaseWithPromises,
    ActivityStreamItem,
    ACTIVITYTYPE,
    MoveParametersConfig
} from "../api"

export class StreamingActivityApi
    extends ActivityApiBaseWithPromises
    implements ActivityApi, ActivityController
{
    // function that will add activity to the gbr stream queue ready to send to gbc
    private readonly _send: (activity: ActivityStreamItem) => void

    constructor(
        kinematicsConfigurationIndex: number,
        defaultMoveParameters: MoveParametersConfig,
        send: (activity: ActivityStreamItem) => void
    ) {
        super(kinematicsConfigurationIndex, defaultMoveParameters)
        this._send = send
    }

    /** @ignore */
    get nextTag(): number {
        return this.currentTag++
    }

    reset() {
        this.currentTag = 1
    }

    /** @ignore */
    execute(command: ActivityStreamItem) {
        return this.createPromise(command.tag, () => this._send(command))
    }

    /**
     * Not used by default for streamed activities. If the stream is configured
     * to require an end program before starting execution, this will be used to end the program. Note that
     * if the GBC queue becomes full, execution will begin even if end program is not sent.
     */
    endProgram() {
        return new EndProgramBuilder(this)
    }
}
