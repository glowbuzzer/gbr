import { ActivityApiBase } from "./activity_api"

export class GCodeActivityProvider extends ActivityApiBase {
    private readonly buffer: unknown[]

    constructor(buffer: unknown[]) {
        super()
        this.buffer = buffer
    }

    get nextTag(): number {
        return 0
    }

    execute(command) {
        this.buffer.push(command)
    }
}
