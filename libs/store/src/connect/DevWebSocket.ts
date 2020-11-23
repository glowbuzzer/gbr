import { Vector3 } from "three"
import { SimulatedArc, SimulatedMoveLine, SimulatedMoveToPosition } from "./dev"
import { configTICK_RATE_HZ, millisecondsPerMachineTick } from "./dev/AbstractSimulatedActivity"

const DevActivityStream = tcp => {
    const queue: any[] = []
    let current

    return {
        add(items: any[]) {
            for (const item of items) {
                switch (item.activityType) {
                    case 1:
                        queue.push(new SimulatedMoveLine(item))
                        break
                    case 2:
                        queue.push(new SimulatedArc(item))
                        break
                    case 5:
                        queue.push(new SimulatedMoveToPosition(item))
                        break
                    default:
                        console.log("Unrecognised stream item", item)
                }
            }
        },

        tick() {
            if (!current) {
                current = queue.splice(0, 1)[0]
                if (current) {
                    current.init(tcp)
                    console.log("NEW CURRENT", current)
                }
            }
            if (current && current.exec) {
                if (!current.exec(tcp)) {
                    current = null
                }
            }
        }
    }
}

export class DevWebSocket implements WebSocket {
    private readonly interval
    private tick = new Date().getTime()
    private statusFrequency = 100
    private readonly telemetry = []
    private readonly tcp = new Vector3()
    private readonly processor = DevActivityStream(this.tcp)

    onopen: () => void
    onclose: () => void
    onerror: () => void
    onmessage: (msg) => void

    constructor(_) {
        setTimeout(() => {
            this.onopen()
        }, 0)

        this.interval = setInterval(() => {
            const scale = Math.max(1.0, this.statusFrequency / 10.0) // input range [0,100] --> [1,10]
            const millisecondsPerStatusMessage = 1000 / scale

            const now = new Date().getTime()
            // let msg = false
            while (this.tick < now) {
                if (this.tick % millisecondsPerMachineTick === 0) {
                    this.execute_tick_handler()
                }
                if (this.tick % millisecondsPerStatusMessage === 0) {
                    this.transmit_status()
                    // msg = true
                }

                this.tick++
            }

            // if (msg) {
            //     this.transmit_status()
            // }
        }, 1000 / configTICK_RATE_HZ)
    }

    execute_tick_handler() {
        this.processor.tick()
        // const value = this.tick / (1000 / configTICK_RATE_HZ)
        // const osc = (value / 182) * Math.PI
        // const rads = (value / 90) * Math.PI
        // this.tcp.setX(Math.sin(rads) * 100 * Math.sin(osc))
        // this.tcp.setY(Math.cos(rads) * 100)

        if (this.tick % (1000 / configTICK_RATE_HZ) === 0) {
            this.telemetry.push({
                x: this.tcp.x,
                y: this.tcp.y,
                z: this.tcp.z
            })
        }
    }

    transmit_status() {
        const { x, y, z } = this.tcp
        const actPos = [x, y, z]
        this.onmessage({
            data: JSON.stringify({
                telemetry: this.telemetry,
                stream: {
                    capacity: 10, // we can actually store lots
                    id: Math.floor(Math.random() * 1000000) // indicate that capacity has changed every time
                },
                devtools: {
                    statusFrequency: this.statusFrequency
                },
                status: {
                    machine: {
                        heartbeat: 0,
                        statusWord: 0b100111,
                        controlWord: 0,
                        target: 2,
                        targetConnectRetryCnt: 0
                    },
                    joint: Array.from({ length: 3 }).map((_, index) => ({
                        controlWord: 0,
                        statusWord: 0,
                        actPos: actPos[index],
                        actVel: 0,
                        actAcc: 0
                    })),
                    kc: [
                        {
                            cartesianActPos: { x, y, z },
                            cartesianActVel: { x: 0, y: 0, z: 0 },
                            cartesianActAcc: { x: 0, y: 0, z: 0 },
                            cartesianActOrientation: { x: 0, y: 0, z: 0, w: 1 },
                            froTarget: 100,
                            froActual: 100,
                            configuration: 0
                        }
                    ],
                    task: Array.from({ length: 3 }).map((_, index) => ({
                        name: `Task ${index}`,
                        status: {
                            taskState: 0,
                            currentActivityIndex: 0
                        }
                    }))
                }
            })
        })
        this.telemetry.splice(0)
    }

    send(msgString) {
        // this receives sends from the client
        const msg = JSON.parse(msgString)
        console.log("Dummy message handler", msg)
        if (msg.devtools) {
            const { statusFrequency } = msg.devtools
            if (!isNaN(statusFrequency)) {
                this.statusFrequency = statusFrequency
            }
        }
        if (msg.stream) {
            this.processor.add(msg.stream)
        }
    }

    close() {
        clearInterval(this.interval)
        this.onclose()
    }

    /**
     * UNUSED WEBSOCKET INTERFACE
     */
    binaryType: BinaryType
    bufferedAmount: number
    extensions: string
    protocol: string
    readyState: number
    url: string
    CLOSED: number
    CLOSING: number
    CONNECTING: number
    OPEN: number

    addEventListener<K extends "close" | "error" | "message" | "open">(
        type: K,
        listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
    addEventListener(type: any, listener: any, options?: any) {
        throw new Error("Method not implemented.")
    }

    removeEventListener<K extends "close" | "error" | "message" | "open">(
        type: K,
        listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
    removeEventListener(type: any, listener: any, options?: any) {
        throw new Error("Method not implemented.")
    }

    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.")
    }
}
