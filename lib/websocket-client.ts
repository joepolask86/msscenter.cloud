"use client"

import { io, Socket } from "socket.io-client"
import { API_URL, getAuthToken } from "./api-client"

type MessageHandler = (data: any) => void

const SOCKET_BASE_URL = API_URL.replace(/\/api\/v1$/, "")

class WebSocketClient {
    private socket: Socket | null = null
    private handlers: Record<string, MessageHandler[]> = {}

    connect() {
        if (typeof window === "undefined") return
        if (this.socket && this.socket.connected) {
            return
        }

        const token = getAuthToken()

        this.socket = io(SOCKET_BASE_URL, {
            path: "/socket.io",
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 30000,
        })

        this.socket.on("connect", () => {
            if (token) {
                this.socket?.emit("auth", { token })
            }
        })

        this.socket.on("notification", (data: any) => {
            const eventHandlers = this.handlers["notification"]
            if (!eventHandlers || eventHandlers.length === 0) return
            eventHandlers.forEach((handler) => handler(data))
        })
    }

    close() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    on(event: string, handler: MessageHandler) {
        if (!this.handlers[event]) {
            this.handlers[event] = []
        }
        this.handlers[event].push(handler)
    }

    off(event: string, handler: MessageHandler) {
        if (!this.handlers[event]) return
        this.handlers[event] = this.handlers[event].filter((h) => h !== handler)
    }
}

export const wsClient = new WebSocketClient()
