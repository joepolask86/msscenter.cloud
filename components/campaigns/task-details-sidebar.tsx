"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface TaskDetailsSidebarProps {
    campaignId: string
}

export function TaskDetailsSidebar({ campaignId }: TaskDetailsSidebarProps) {
    const [stats, setStats] = useState({ total: 0, completed: 0, investment: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (campaignId) {
            const fetchStats = async () => {
                try {
                    setLoading(true)
                    const data = await api.get<{ total: number, completed: number, investment: number }>(`/campaigns/${campaignId}/task-stats`)
                    setStats(data)
                } catch (error) {
                    console.error("Failed to fetch task stats:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchStats()
        }
    }, [campaignId])

    return (
        <div className="space-y-4">
            {/* Total Investment */}
            <Card>
                <CardContent className="text-center py-4">
                    <div className="flex justify-center mb-2">
                        {loading ? (
                            <Skeleton className="h-12 w-48" />
                        ) : (
                            <div className="text-5xl font-bold text-primary">${stats.investment.toFixed(2)}</div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Total Investment</h3>
                    <p className="text-xs text-muted-foreground">
                        The total amount of money spent on this site to rank it
                    </p>
                </CardContent>
            </Card>

            {/* Task Counter */}
            <Card>
                <CardContent className="text-center py-4">
                    <div className="flex justify-center mb-3">
                        {loading ? (
                            <Skeleton className="h-12 w-16" />
                        ) : (
                            <div className="text-5xl font-bold">{stats.total}</div>
                        )}
                    </div>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">TASK ADDED</Badge>
                </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card>
                <CardContent className="text-center py-4">
                    <div className="flex justify-center mb-3">
                        {loading ? (
                            <Skeleton className="h-12 w-16" />
                        ) : (
                            <div className="text-5xl font-bold">{stats.completed}</div>
                        )}
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">TASK COMPLETED</Badge>
                </CardContent>
            </Card>
        </div>
    )
}
