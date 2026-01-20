 "use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    calls: {
        label: "Completed Calls",
        color: "hsl(142.1 76.2% 36.3%)", // Green
    },
} satisfies ChartConfig

interface ChartDataPoint {
    date: string;
    calls: number;
}

interface ChartResponse {
    data: ChartDataPoint[];
    startDate: string;
    endDate: string;
}

export function IncomingCallsChart() {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getLast14DaysOfCurrentMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstOfMonth = new Date(year, month, 1);
        const startCandidate = new Date(today);
        startCandidate.setDate(today.getDate() - 13);
        const startDateObj = startCandidate < firstOfMonth ? firstOfMonth : startCandidate;
        const format = (date: Date) => date.toISOString().slice(0, 10);
        return {
            startDate: format(startDateObj),
            endDate: format(today),
        };
    };

    const fetchChartData = async () => {
        try {
            setLoading(true);
            const { startDate, endDate } = getLast14DaysOfCurrentMonth();
            const params = new URLSearchParams({
                startDate,
                endDate,
            });
            const response = await api.get<ChartResponse>(`/dashboard/calls-chart?${params.toString()}`);

            const start = new Date(startDate);
            const end = new Date(endDate);
            const dayMs = 24 * 60 * 60 * 1000;

            const callsByDate = new Map<string, number>();
            response.data.forEach(item => {
                const key = item.date.slice(0, 10);
                callsByDate.set(key, item.calls);
            });

            const filledData: ChartDataPoint[] = [];

            for (let current = new Date(start); current <= end; current = new Date(current.getTime() + dayMs)) {
                const key = current.toISOString().slice(0, 10);
                const calls = callsByDate.get(key) ?? 0;
                const monthLabel = (current.getUTCMonth() + 1).toString().padStart(2, '0');
                const dayLabel = current.getUTCDate().toString().padStart(2, '0');
                filledData.push({
                    date: `${monthLabel}/${dayLabel}`,
                    calls,
                });
            }

            setData(filledData);
            setError(null);
        } catch (err) {
            console.error('Chart error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle className="text-orange-500 font-medium">Incoming Calls <span className="text-sm text-muted-foreground font-normal ml-2">(all campaigns, all numbers)</span></CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <div className="aspect-auto h-[220px] w-full flex items-end justify-between gap-4">
                        {[...Array(20)].map((_, i) => (
                            <Skeleton key={i} className="w-full" style={{ height: `${((i * 37) % 60) + 20}%` }} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle className="text-orange-500 font-medium">Incoming Calls</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[280px] flex flex-col items-center justify-center gap-4">
                    <p className="text-destructive">Failed to load chart data</p>
                    <Button onClick={fetchChartData} variant="outline" size="sm">Retry</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle className="text-orange-500 font-medium">Incoming Calls <span className="text-sm text-muted-foreground font-normal ml-2">(all campaigns, all numbers)</span></CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-calls)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-calls)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="calls"
                            type="monotone"
                            fill="url(#fillCalls)"
                            fillOpacity={0.4}
                            stroke="var(--color-calls)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
