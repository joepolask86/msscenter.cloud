"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, PhoneMissed, PhoneForwarded, DollarSign } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface ElocalStatsResponse {
    totalCalls: number
    answeredCalls: number
    validCalls: number
    soldCalls: number
    missedCalls: number
    totalValue: number
}

interface DateRange {
    from: Date
    to: Date
}

interface ElocalStatsProps {
    dateRange: DateRange
}

export function ElocalStats({ dateRange }: ElocalStatsProps) {
    const [stats, setStats] = useState<ElocalStatsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (dateRange.from) {
                params.append("startDate", format(dateRange.from, "yyyy-MM-dd"))
            }
            if (dateRange.to) {
                params.append("endDate", format(dateRange.to, "yyyy-MM-dd"))
            }
            const query = params.toString() ? `?${params.toString()}` : ""
            const data = await api.get<ElocalStatsResponse>(`/elocal/stats${query}`)
            setStats(data)
            setError(null)
        } catch (err) {
            console.error("Elocal stats error:", err)
            setError(err instanceof Error ? err.message : "Failed to load eLocal stats")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [dateRange.from, dateRange.to])

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-orange-500 font-medium">
                    Overview Data{" "}
                    <span className="text-gray-400 font-normal text-sm ml-2">
                        (all campaigns, all numbers)
                    </span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="space-y-4">
                <h3 className="text-orange-500 font-medium">
                    Overview Data{" "}
                    <span className="text-gray-400 font-normal text-sm ml-2">
                        (all campaigns, all numbers)
                    </span>
                </h3>
                <Card className="p-6">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-destructive">Failed to load eLocal stats</p>
                        <Button onClick={fetchStats} variant="outline" size="sm">
                            Retry
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    const uniqueCalls = stats.validCalls
    const missedCalls = stats.missedCalls
    const totalValue = typeof stats.totalValue === "number" ? stats.totalValue : 0

    return (
        <div className="space-y-4">
            <h3 className="text-orange-500 font-medium">
                Overview Data{" "}
                <span className="text-gray-400 font-normal text-sm ml-2">
                    (all campaigns, all numbers)
                </span>
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl text-teal-500 font-bold">
                                {stats.totalCalls}
                            </p>
                            <Phone className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">
                            Total Calls
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl text-green-500 font-bold">
                                {stats.answeredCalls}
                            </p>
                            <Phone className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">
                            Answered Calls
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl text-red-500 font-bold">{missedCalls}</p>
                            <PhoneMissed className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">
                            Missed Calls
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold text-green-500">
                                {uniqueCalls}
                                <span className="text-gray-300 mx-1">/</span>
                                {stats.soldCalls}
                            </p>
                            <PhoneForwarded className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">
                            Unique/Sold Calls
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl text-green-500 font-bold">
                                ${totalValue.toFixed(2)}
                            </p>
                            <DollarSign className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">
                            Total Calls Revenue
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
