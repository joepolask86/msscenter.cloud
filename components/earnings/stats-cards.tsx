"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Phone } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface DateRange {
    from: Date
    to: Date
}

interface EarningsByNicheItem {
    nicheId: number
    nicheName: string
    amount: number
}

interface EarningsSummary {
    totalEarnings: number
    monthlyEarnings: number
    byNiche: EarningsByNicheItem[]
}

interface ElocalStats {
    totalCalls: number
    answeredCalls: number
    validCalls: number
    soldCalls: number
    missedCalls: number
    totalValue: number
}

interface EarningsStatsProps {
    dateRange: DateRange
    refreshToken?: number
}

export function EarningsStats({ dateRange, refreshToken }: EarningsStatsProps) {
    const [summary, setSummary] = useState<EarningsSummary | null>(null)
    const [annualEarnings, setAnnualEarnings] = useState(0)
    const [elocalCalls, setElocalCalls] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const params = new URLSearchParams()
                if (dateRange.from) {
                    params.append("startDate", dateRange.from.toISOString())
                }
                if (dateRange.to) {
                    params.append("endDate", dateRange.to.toISOString())
                }

                const query = params.toString() ? `?${params.toString()}` : ""

                const year = dateRange.from.getFullYear()
                const yearStart = new Date(year, 0, 1)
                const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999)
                const yearParams = new URLSearchParams()
                yearParams.append("startDate", yearStart.toISOString())
                yearParams.append("endDate", yearEnd.toISOString())
                const yearQuery = `?${yearParams.toString()}`

                const [rangeSummary, annualSummary, elocalStats] = await Promise.all([
                    api.get<EarningsSummary>(`/earnings/summary${query}`),
                    api.get<EarningsSummary>(`/earnings/summary${yearQuery}`),
                    api.get<ElocalStats>(`/elocal/stats${query}`),
                ])

                setSummary(rangeSummary)
                setAnnualEarnings(annualSummary.totalEarnings ?? 0)
                setElocalCalls(elocalStats.answeredCalls ?? elocalStats.totalCalls ?? 0)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Failed to load earnings summary")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [dateRange.from, dateRange.to, refreshToken])

    const totalEarnings = summary?.totalEarnings ?? 0
    const monthlyEarnings = summary?.monthlyEarnings ?? 0
    const annualTotal = annualEarnings

    const formatCurrency = (value: number) =>
        value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        })

    const formatRangeLabel = (range: DateRange) => {
        const from = range.from
        const to = range.to
        if (!from || !to) {
            return ""
        }

        const sameMonth =
            from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()

        const fromLabel = from.toLocaleString("en-US", { month: "short", year: "numeric" })
        const toLabel = to.toLocaleString("en-US", { month: "short", year: "numeric" })

        if (sameMonth) {
            return `(${fromLabel})`
        }

        return `(${fromLabel} - ${toLabel})`
    }

    const currentRangeLabel = formatRangeLabel(dateRange)
    const currentYear = dateRange.from.getFullYear()

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Earnings (Alltime)
                    </CardTitle>
                    <Calendar className="h-8 w-8 text-muted-foreground absolute right-4 top-0 opacity-30" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {loading ? (
                            <Skeleton className="h-7 w-28 mb-1" />
                        ) : (
                            formatCurrency(totalEarnings)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Lifetime Revenue
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Current Month
                    </CardTitle>
                    <DollarSign className="h-8 w-8 text-muted-foreground absolute right-4 top-0 opacity-30" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {loading ? (
                            <Skeleton className="h-7 w-24 mb-1" />
                        ) : (
                            formatCurrency(monthlyEarnings)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        {currentRangeLabel} Revenue
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Earnings (Annual)
                    </CardTitle>
                    <DollarSign className="h-8 w-8 text-muted-foreground absolute right-4 top-0 opacity-30" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {loading ? (
                            <Skeleton className="h-7 w-32 mb-1" />
                        ) : (
                            formatCurrency(annualTotal)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        ({currentYear}) Revenue
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        eLocal Calls
                    </CardTitle>
                    <Phone className="h-8 w-8 text-muted-foreground absolute right-4 top-0 opacity-30" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {loading ? (
                            <Skeleton className="h-7 w-16 mb-1" />
                        ) : (
                            elocalCalls ?? 0
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        {currentRangeLabel} Answered Calls
                    </p>
                    {error && !loading && (
                        <p className="text-xs text-red-500 mt-2">
                            {error}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
