/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    ActivityApi,
    ActivityApiBase,
    ActivityController,
    ActivityStreamItem,
    MoveParametersConfig
} from "@glowbuzzer/store"

interface StreamingActivityApi extends ActivityApi {
    something(): void
}

export class StreamingActivityApiImpl
    extends ActivityApiBase
    implements StreamingActivityApi, ActivityController
{
    private readonly index: number
    private readonly _send: (msg: string) => void
    private currentTag = 0

    constructor(
        index: number,
        defaultMoveParameters: MoveParametersConfig,
        send: (msg: string) => void
    ) {
        super(index, defaultMoveParameters)
        this.index = index
        this._send = send
    }

    something(): void {}

    get nextTag(): number {
        return this.currentTag++
    }

    execute(command) {
        console.log("Need to execute command", command)
    }

    // enqueue(items: ActivityStreamItem[]) {
    //     const msg = JSON.stringify({
    //         stream: {
    //             streamIndex: this.index,
    //             items
    //         }
    //     })
    //
    //     this._send(msg)
    // }
}
