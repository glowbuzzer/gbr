/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ActivityApi, ActivityController } from "../activity"
import { ActivityApiBaseWithPromises, ActivityStreamItem, MoveParametersConfig } from "../api"

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

    get nextTag(): number {
        return this.currentTag++
    }

    execute(command: ActivityStreamItem) {
        return this.createPromise(command.tag, () => this._send(command))
    }

    send(
        ...items: Promise<{ tag: number; completed: boolean } | void>[]
    ): Promise<({ tag: number; completed: boolean } | void)[]> {
        return Promise.all(items)
    }
}
