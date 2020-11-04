const configTICK_RATE_HZ = 25 // try to make 1000 divisible by this number

export class DevWebSocket implements WebSocket {
    private readonly interval
    private tick = new Date().getTime()
    private statusFrequency = 100

    onopen: () => void
    onclose: () => void
    onerror: () => void
    onmessage: (msg) => void

    constructor(_) {
        setTimeout(() => {
            this.onopen()
        }, 0)

        const telemetry = []

        this.interval = setInterval(() => {
            const scale = Math.max(1.0, this.statusFrequency / 10.0) // input range [0,100] --> [1,10]
            const mod = 1000 / scale

            const now = new Date().getTime()
            let x
            let y
            let msg = false
            while (this.tick < now) {
                if (this.tick % mod === 0) {
                    msg = true
                }
                if (this.tick % (1000 / configTICK_RATE_HZ) === 0) {
                    const value = this.tick / (1000 / configTICK_RATE_HZ)
                    const osc = (value / 182) * Math.PI
                    const rads = (value / 90) * Math.PI
                    x = Math.sin(rads) * 100 * Math.sin(osc)
                    y = Math.cos(rads) * 100

                    telemetry.push({
                        x,
                        y,
                        z: 0
                    })
                }
                this.tick++
            }

            if (!msg) {
                return
            }

            this.onmessage({
                data: JSON.stringify({
                    telemetry,
                    stream: {
                        capacity: 10
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
                            actPos: index === 0 ? x : index === 1 ? y : 0,
                            actVel: 0,
                            actAcc: 0
                        })),
                        kc: [
                            {
                                cartesianActPos: { x: x, y: y, z: 0 },
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
            telemetry.splice(0)
        }, 1000 / configTICK_RATE_HZ)
    }

    send(msgString) {
        const msg = JSON.parse(msgString)
        console.log("Dummy message handler", msg)
        if (msg.devtools) {
            const { statusFrequency } = msg.devtools
            if (!isNaN(statusFrequency)) {
                this.statusFrequency = statusFrequency
            }
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
