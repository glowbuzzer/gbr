import { ActivityApiBase } from "./activity_api"

export class GCodeActivityProvider extends ActivityApiBase {
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly buffer: unknown[]
    private _tag = 0

    constructor(buffer: unknown[]) {
        super()
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
