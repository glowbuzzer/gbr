import { Line3, Vector3 } from "three"
import { AbstractSimulatedActivity } from "./AbstractSimulatedActivity"

abstract class AbstractSimulatedLinearMove extends AbstractSimulatedActivity {
    protected line: Line3

    protected constructor(config, end_accessor) {
        const { x, y, z } = end_accessor(config)
        super(new Vector3(x, y, z))
    }

    init(tcp: Vector3) {
        this.start = tcp.clone()
        this.line = new Line3(this.start, this.end)
        this.distance = this.start.distanceTo(this.end)
    }

    exec_internal(tcp: Vector3, elapsed_ticks: number) {
        this.line.at(this.tick / elapsed_ticks, tcp) // this will update tcp directly
    }
}

export class SimulatedMoveLine extends AbstractSimulatedLinearMove {
    constructor(config) {
        super(config, config => config.moveLine.line.position)
    }
}

export class SimulatedMoveToPosition extends AbstractSimulatedLinearMove {
    constructor(config) {
        super(config, config => config.moveToPosition.cartesianPosition.position.position)
    }
}

export * from "./SimulatedArc"
