import { MessageResponse } from "./RequestResponseHandler"
import React from "react"
import { GlowbuzzerStatus } from "../gbc_extra"

export enum ConnectionState {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED"
}

export type GlowbuzzerConnectionContextType = {
    /** Indicates if connection has been established */
    connected: boolean
    /** Connect to remote websocket on the given url, and indicate if auto-reconnect is enabled (default: true) */
    connect(url: string, autoConnect?: boolean): void
    /** Disconnect from remote websocket */
    disconnect(): void
    /** Reconnect to the last connected url */
    reconnect(): void
    /** Send a message to the remote websocket */
    send(msg: string): void
    /** Send a request to the remote websocket and return a promise that resolves when the request has been completed */
    request(type: string, body: object): Promise<MessageResponse>
    /** The current connection state */
    state: ConnectionState
    /** Whether status messages are being received */
    statusReceived: boolean
    /** Whether the connection should be reestablished automatically if it drops */
    autoConnect: boolean
    /** The last status message received */
    lastStatus: GlowbuzzerStatus["status"]
}

export const GlowbuzzerConnectionContext =
    React.createContext<GlowbuzzerConnectionContextType>(null)

/**
 * Provides a way to connect to a remote instance of GBC, and send and receive messages.
 */
export function useConnection() {
    const context = React.useContext(GlowbuzzerConnectionContext)
    if (!context) {
        throw new Error("useConnection must be used within a ConnectionProvider")
    }

    return context
}

export function useLastStatus() {
    const context = React.useContext(GlowbuzzerConnectionContext)
    if (!context) {
        throw new Error("useConnection must be used within a ConnectionProvider")
    }
    return context.lastStatus
}

export * from "./StatusProcessor"
export * from "./RequestResponseHandler"
