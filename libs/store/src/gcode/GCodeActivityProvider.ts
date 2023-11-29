/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import { ActivityApiBase } from ".."
import { ActivityPromiseResult, EndProgramBuilder, PauseProgramBuilder } from ".."

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

    execute(command: any): Promise<ActivityPromiseResult> {
        this.buffer.push(command)
        return Promise.resolve({ tag: this._tag, completed: true })
    }

    endProgram() {
        return new EndProgramBuilder(this)
    }

    pauseProgram() {
        return new PauseProgramBuilder(this)
    }
}
