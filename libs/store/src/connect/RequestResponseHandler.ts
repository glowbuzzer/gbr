/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useEffect, useMemo, useRef, useState } from "react"

export type MessageResponse = {
    requestId?: string
    requestType: string
    [index: string]: any
} & ({ error: false } | { error: true; message: string })

type RequestStore = Record<
    string,
    {
        resolve: (value: MessageResponse) => void
        reject: (reason: any) => void
    }
>

export function useRequestHandler() {
    const requests = useRef<RequestStore>({})

    return {
        request(connection: WebSocket, requestType, args?): Promise<MessageResponse> {
            const requestId = Math.random().toString(36).substring(2, 15)
            console.log("New request", requestId, requestType)
            return new Promise<MessageResponse>((resolve, reject) => {
                requests.current[requestId] = { resolve, reject }
                connection.send(
                    JSON.stringify({
                        request: {
                            requestId,
                            requestType,
                            ...args
                        }
                    })
                )
                setTimeout(() => {
                    if (requests.current[requestId]) {
                        delete requests.current[requestId]
                        reject("Timeout waiting for response: " + requestId)
                    }
                }, 5000)
            })
        },
        response(msg) {
            const { requestId, requestType, error, message, ...body } = msg
            if (!requests.current[requestId]) {
                // already resolved, ignore
                console.log("Ignore unknown response: " + requestId)
                return
            }
            const { resolve, reject } = requests.current[requestId]
            delete requests.current[requestId]

            if (error) {
                reject(message)
            } else {
                console.log(
                    "Resolve response: " +
                        requestId +
                        " " +
                        requestType +
                        " " +
                        error +
                        " " +
                        message
                )
                resolve(body)
            }
        },
        clear() {
            for (const requestId in requests.current) {
                if (requests[requestId]) {
                    requests[requestId].reject("Connection closed")
                }
            }
            requests.current = {}
        }
    }
}
