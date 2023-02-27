/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ActivityBuilder, ActivityController } from "../activity"
import { ActivityApi, ActivityApiBase, ActivityStreamItem, MoveParametersConfig } from "../api"

export interface StreamingActivityApi extends ActivityApi {
    /**
     * Enqueue the provided activities. The activities provided will be added to the stream queue and executed in order.
     *
     * To cancel the execution of the activities, use the useStream hook.
     *
     * @param builders The array of activity builders to execute
     */
    enqueue(...builders: ActivityBuilder[]): void
}

export class StreamingActivityApiImpl
    extends ActivityApiBase
    implements ActivityApi, ActivityController
{
    private currentTag = 0
    private readonly dispatch: (activity: ActivityStreamItem) => void

    constructor(
        kinematicsConfigurationIndex: number,
        defaultMoveParameters: MoveParametersConfig,
        dispatch: (activity: ActivityStreamItem) => void
    ) {
        super(kinematicsConfigurationIndex, defaultMoveParameters)
        this.dispatch = dispatch
    }

    get nextTag(): number {
        return this.currentTag++
    }

    execute(command: ActivityStreamItem) {
        this.dispatch(command)
    }

    enqueue(...items: ActivityBuilder[]) {
        Promise.all(items.map(i => i.promise())).catch(e => {
            console.error(e)
        })
    }
}
