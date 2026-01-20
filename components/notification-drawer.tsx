"use client"

import * as React from "react"
import { Bell, Check, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api-client"
import { wsClient } from "@/lib/websocket-client"
import { formatDistanceToNow, parseISO } from "date-fns"

interface ApiNotification {
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    priority?: "low" | "medium" | "high"
    actionUrl?: string
    createdAt?: string
}

interface NotificationDrawerProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function NotificationDrawer({ trigger, open: controlledOpen, onOpenChange: setControlledOpen }: NotificationDrawerProps) {
    const [notifications, setNotifications] = React.useState<ApiNotification[]>([])
    const [unreadCount, setUnreadCount] = React.useState<number>(0)
    const [internalOpen, setInternalOpen] = React.useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = React.useCallback((newOpen: boolean) => {
        if (isControlled && setControlledOpen) {
            setControlledOpen(newOpen)
        } else {
            setInternalOpen(newOpen)
        }
    }, [isControlled, setControlledOpen])

    const fetchNotifications = React.useCallback(async () => {
        try {
            const data = await api.get<{ notifications: ApiNotification[]; unreadCount: number }>(`/notifications?page=1&limit=20`)
            setNotifications(data.notifications || [])
            setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : (data.notifications || []).filter((n) => !n.isRead).length)
        } catch {
            setNotifications([])
            setUnreadCount(0)
        }
    }, [])

    const fetchUnreadCount = React.useCallback(async () => {
        try {
            const data = await api.get<{ count: number }>(`/notifications/unread-count`)
            setUnreadCount(data.count || 0)
        } catch {
            setUnreadCount(notifications.filter((n) => !n.isRead).length)
        }
    }, [notifications])

    React.useEffect(() => {
        wsClient.connect()

        const handleNotification = (notification: ApiNotification) => {
            setNotifications((prev) => [notification, ...prev])
            setUnreadCount((prev) => prev + (notification.isRead ? 0 : 1))
        }

        wsClient.on("notification", handleNotification)

        return () => {
            wsClient.off("notification", handleNotification)
        }
    }, [])

    React.useEffect(() => {
        if (open) {
            fetchNotifications()
        } else {
            fetchUnreadCount()
        }
    }, [open, fetchNotifications, fetchUnreadCount])

    const markAsRead = async (id: string) => {
        try {
            const res = await api.put<{ success: boolean; notification: ApiNotification }>(`/notifications/${id}/read`)
            if (res?.success && res.notification) {
                setNotifications((prev) => prev.map((n) => (n.id === id ? res.notification : n)))
                fetchUnreadCount()
            } else {
                setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
                setUnreadCount((prev) => Math.max(0, prev - 1))
            }
        } catch {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
            setUnreadCount((prev) => Math.max(0, prev - 1))
        }
    }

    const markAllAsRead = async () => {
        try {
            await api.put<{ success: boolean; markedCount: number }>(`/notifications/mark-all-read`)
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        }
    }

    const deleteNotification = async (id: string) => {
        try {
            await api.delete<{ success: boolean }>(`/notifications/${id}`)
            setNotifications((prev) => {
                const target = prev.find((n) => n.id === id)
                const next = prev.filter((n) => n.id !== id)
                if (target && !target.isRead) {
                    setUnreadCount((prevCount) => Math.max(0, prevCount - 1))
                }
                return next
            })
        } catch {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
    }

    const clearAll = async () => {
        try {
            await api.delete<{ success: boolean; deletedCount: number }>(`/notifications/clear-all`)
            setNotifications((prev) => prev.filter((n) => !n.isRead))
        } catch {
            setNotifications((prev) => prev.filter((n) => !n.isRead))
        }
    }

    const getPriorityColor = (priority?: ApiNotification["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-500/10 text-red-600 dark:text-red-400"
            case "medium":
                return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
            case "low":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            default:
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger ? trigger : (
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 shadow-none border-none rounded-md w-8 h-8"
                    >
                        <Bell className="h-[1.2rem] w-[1.2rem]" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center text-white justify-center p-0 text-xs"
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-full w-full [&[data-vaul-drawer-direction=right]]:rounded-none [&[data-vaul-drawer-direction=right]]:max-w-xl">
                <DrawerHeader className="border-b bg-accent dark:bg-accent-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <DrawerTitle>Notifications</DrawerTitle>
                            <DrawerDescription>
                                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                            </DrawerDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="h-8 w-8 cursor-pointer"
                                >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Mark all as read</span>
                                </Button>
                            )}
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>

                </DrawerHeader>

                <ScrollArea className="flex-1 px-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-2 py-4">
                            {notifications.map((notification) => (
                                <div key={notification.id}>
                                    <div
                                        className={`group relative rounded-lg border p-4 transition-colors ${!notification.isRead
                                            ? "bg-accent/50 border-accent"
                                            : "hover:bg-accent/30"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? "bg-primary" : "bg-transparent"
                                                    }`}
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium leading-none">
                                                        {notification.title}
                                                    </p>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs ${getPriorityColor(notification.priority)}`}
                                                    >
                                                        {notification.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {notification.createdAt ? formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true }) : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 cursor-pointer"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                    <span className="sr-only">Mark as read</span>
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive cursor-pointer"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <DrawerFooter className="border-t">
                        <Button variant="outline" onClick={clearAll} className="w-[200px] cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear read notifications
                        </Button>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    )
}
