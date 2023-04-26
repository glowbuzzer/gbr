/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import { ActivityApiBase } from "../activity/api/base"
import { EndProgramBuilder, PauseProgramBuilder } from "../activity/api/builders"

/** @ignore - internal to the GCodeSenderAdapter */
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

    endProgram() {
        return new EndProgramBuilder(this)
    }

    pauseProgram() {
        return new PauseProgramBuilder(this)
    }
}
