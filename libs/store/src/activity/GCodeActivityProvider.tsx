/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { ActivityApiBase } from "./activity_api"

export class GCodeActivityProvider extends ActivityApiBase {
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly buffer: unknown[]
    private _tag = 0

    constructor(kinematicsConfigurationIndex: number, buffer: unknown[]) {
        super(kinematicsConfigurationIndex, null)
        this.buffer = buffer
    }

    get nextTag(): number {
        return this._tag
    }

    setTag(n: number) {
        this._tag = n
        return this
    }

    execute(command) {
        this.buffer.push(command)
    }
}
