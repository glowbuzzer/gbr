/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

export type MessageResponse = {
    requestId?: string
    requestType: string
    [index: string]: any
} & ({ error: false } | { error: true; message: string })

export class RequestResponseHandler {
    private readonly connection: WebSocket

    constructor(connection: WebSocket) {
        this.connection = connection
    }

    private requests: {
        [index: string]: {
            resolve: (value: MessageResponse) => void
            reject: (reason: any) => void
        }
    } = {}

    request(requestType, args?): Promise<MessageResponse> {
        const requestId = Math.random().toString(36).substring(2, 15)
        return new Promise<MessageResponse>((resolve, reject) => {
            this.requests[requestId] = { resolve, reject }
            this.connection.send(
                JSON.stringify({
                    request: {
                        requestId,
                        requestType,
                        ...args
                    }
                })
            )
            setTimeout(() => {
                if (this.requests[requestId]) {
                    reject("Timeout waiting for response: " + requestId)
                }
            }, 5000)
        })
    }

    response(msg) {
        const { requestId, requestType, error, message, ...body } = msg
        if (!this.requests[requestId]) {
            // already resolved, ignore
            return
        }
        const { resolve, reject } = this.requests[requestId]
        delete this.requests[requestId]

        if (error) {
            reject(message)
        } else {
            resolve(body)
        }
    }

    terminate() {
        for (const { reject } of Object.values(this.requests)) {
            reject("Connection terminated")
        }
        this.requests = {}
    }
}
