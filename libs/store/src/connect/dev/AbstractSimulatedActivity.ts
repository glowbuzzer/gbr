import { Vector3 } from "three"

export const configTICK_RATE_HZ = 25 // try to make 1000 divisible by this number
export const millisecondsPerMachineTick = 1000 / configTICK_RATE_HZ
const VMAX = 1000 // TODO: get this from config somehow

export abstract class AbstractSimulatedActivity {
    protected tick = 0
    protected start: Vector3
    protected readonly end: Vector3
    protected distance: number

    protected constructor(end: Vector3) {
        this.end = end
    }

    abstract init(tcp: Vector3)

    abstract exec_internal(tcp: Vector3, elapsed_ticks: number)

    exec(tcp: Vector3) {
        const time_in_seconds = Math.ceil(this.distance / VMAX)
        const time_in_ticks = time_in_seconds * configTICK_RATE_HZ

        if (time_in_seconds < 0.001) {
            return false
        }

        this.exec_internal(tcp, time_in_ticks)

        this.tick++
        return this.tick <= time_in_ticks
    }
}
