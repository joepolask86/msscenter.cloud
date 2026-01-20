"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/lib/api-client"

interface MonthlyTrendItem {
    month: string
    amount: number
}

interface MonthlyTrendResponse {
    trend: MonthlyTrendItem[]
}

const chartConfig = {
    earnings: {
        label: "Earnings",
        color: "#22c55e",
    },
} satisfies ChartConfig

export function EarningsChart() {
    const [data, setData] = useState<MonthlyTrendItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTrend = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await api.get<MonthlyTrendResponse>("/earnings/monthly-trend?months=12")
                const currentYear = new Date().getFullYear()

                const filtered = (response.trend || []).filter((item) => {
                    const [year] = item.month.split("-")
                    return Number(year) === currentYear
                })

                const monthToAmount = new Map<string, number>()
                for (const item of filtered) {
                    monthToAmount.set(item.month, item.amount)
                }

                const fullYearData: MonthlyTrendItem[] = Array.from({ length: 12 }, (_, index) => {
                    const monthNumber = String(index + 1).padStart(2, "0")
                    const key = `${currentYear}-${monthNumber}`
                    return {
                        month: key,
                        amount: monthToAmount.get(key) ?? 0,
                    }
                })

                setData(fullYearData)
            } catch (err) {
                setData([])
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Failed to load earnings trend")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTrend()
    }, [])

    const formattedData = data.map((item) => {
        const [year, month] = item.month.split("-")
        const date = new Date(Number(year), Number(month) - 1, 1)
        const label = date.toLocaleString("en-US", { month: "short" })

        return {
            month: label,
            earnings: item.amount,
        }
    })

    const currentYear = new Date().getFullYear()

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>
                        Earnings Breakdown <span className="text-sm text-muted-foreground">({currentYear})</span>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {error && !loading && (
                    <p className="text-sm text-red-500 mb-2">
                        {error}
                    </p>
                )}
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-earnings)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-earnings)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="earnings"
                            type="monotone"
                            fill="url(#fillEarnings)"
                            fillOpacity={0.4}
                            stroke="var(--color-earnings)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
