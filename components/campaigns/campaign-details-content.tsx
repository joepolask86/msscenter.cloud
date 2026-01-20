"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { CalendarDatePicker } from "@/components/earnings/date-range-picker"
import { api } from "@/lib/api-client"
import { format, parseISO } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface CampaignDetailsContentProps {
    campaignId: string
}

const chartConfig = {
    visits: {
        label: "Visits",
        color: "hsla(142, 82%, 26%, 1.00)",
    },
} satisfies ChartConfig

export function CampaignDetailsContent({ campaignId }: CampaignDetailsContentProps) {
    const [dateRange, setDateRange] = React.useState<DateRange>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
        to: new Date() // Today
    })
    const [analytics, setAnalytics] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [campaign, setCampaign] = React.useState<any>(null)

    const fetchCampaign = async () => {
        try {
            const data = await api.get<any>(`/campaigns/${campaignId}`)
            setCampaign(data)
        } catch (error) {
            console.error("Failed to fetch campaign:", error)
        }
    }

    const fetchAnalytics = async () => {
        if (!dateRange?.from || !dateRange?.to) return
        setLoading(true)
        try {
            const fromStr = format(dateRange.from, 'yyyy-MM-dd')
            const toStr = format(dateRange.to, 'yyyy-MM-dd')
            const data = await api.get(`/campaigns/${campaignId}/analytics?from=${fromStr}&to=${toStr}`)
            setAnalytics(data)
        } catch (error) {
            console.error("Failed to fetch analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (campaignId) {
            fetchCampaign()
        }
    }, [campaignId])

    React.useEffect(() => {
        if (!campaignId || !campaign?.atrafficId) return
        fetchAnalytics()
    }, [campaignId, campaign?.atrafficId, dateRange])



    const formatDuration = (seconds: number): string => {
        if (Number.isNaN(seconds) || seconds < 0) return "0min 0s"

        const totalSeconds = Math.floor(seconds)
        const minutes = Math.floor(totalSeconds / 60)
        const remainingSeconds = totalSeconds % 60

        return `${minutes}min ${remainingSeconds}s`
    }

    const chartData = React.useMemo(() => {
        if (!analytics?.over_time) return []
        return Object.entries(analytics.over_time).map(([date, metrics]: [string, any]) => {
            const visits = Array.isArray(metrics) ? 0 : (metrics.nb_visits || 0)
            return {
                date: format(parseISO(date), "dd/MM"),
                visits
            }
        })
    }, [analytics])

    const summary = analytics?.summary || {}
    // Access first event category for overview
    const topEvent = Array.isArray(analytics?.events) && analytics.events.length > 0 ? analytics.events[0] : null

    return (
        <div className="space-y-6">
            {/* ... skipping to Events Overview Section ... */}
            {/* Traffic Data Section */}
            <Card className="pt-0">
                <CardHeader className="border-b border-accent-200 [.border-b]:pb-3 pt-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base font-semibold text-primary">
                            TRAFFIC DATA - {campaign?.url ? campaign.url : "Loading..."}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {!campaign?.atrafficId ? (
                        <p className="text-sm text-muted-foreground">
                            Sorry there is no matomo traffic ID setup for this site. Please come back later!
                        </p>
                    ) : (
                        <>
                            {/* Visits Over Time Chart */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Visits Over Time  <span className="text-sm text-muted-foreground">(Last 14 Days)</span></h3>
                                    <div className="flex gap-2">
                                        <CalendarDatePicker
                                            date={dateRange}
                                            onDateSelect={(range) => setDateRange(range)}
                                            className="w-[260px]"
                                            variant="outline"
                                        />

                                    </div>
                                </div>

                                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                                    <AreaChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--color-visits)"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--color-visits)"
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
                                            dataKey="visits"
                                            type="monotone"
                                            fill="url(#fillVisits)"
                                            fillOpacity={0.4}
                                            stroke="var(--color-visits)"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </div>

                            {/* Visits Overview */}
                            <div>
                                <h3 className="text-lg text-primary font-semibold mb-4">Visits Overview</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <Card>
                                        <CardContent className="pt-2 text-center">
                                            <div className="text-4xl font-bold text-green-600">{summary.nb_visits || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-2">VISITS</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-2 text-center">
                                            <div className="text-4xl font-bold">{summary.nb_uniq_visitors || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-2">UNIQUE VISITORS</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-2 text-center">
                                            <div className="text-4xl font-bold">{summary.nb_actions_per_visit || 0}</div>
                                            <p className="text-xs text-muted-foreground mt-2">ACTIONS PER VISIT</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Time Metrics */}
                            <div className="grid grid-cols-3 gap-3">
                                <Card>
                                    <CardContent className="pt-2 text-center">
                                        <div className="text-2xl font-bold">{formatDuration(summary.avg_time_on_site || 0)}</div>
                                        <p className="text-xs text-muted-foreground mt-2">AVG VISIT DURATIONS</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-2 text-center">
                                        <div className="text-2xl font-bold">{summary.sum_visit_length_pretty || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-2">TOTAL TIME SPENT</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-2 text-center">
                                        <div className="text-2xl font-bold">{summary.bounce_rate || "0%"}</div>
                                        <p className="text-xs text-muted-foreground mt-2">BOUNCE RATE</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Events Overview */}
                            <div>
                                <h3 className="text-lg text-primary font-semibold mb-4">Events Overview</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="pt-0 text-center space-y-1">
                                            {/* Assuming Events data usually contains 'Click to Call' or similar categories, doing placeholder for now or mapping if structure known */}
                                            <div className="text-2xl font-bold text-green-600">{analytics?.events?.length || 0}</div>
                                            <p className="text-xs font-medium text-green-600">EVENTS COUNT</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-0 text-center space-y-1">
                                            <div className="text-2xl font-bold">{topEvent?.sum_daily_nb_uniq_visitors || 0}</div>
                                            <p className="text-xs font-medium text-muted-foreground">DAILY UNIQUE VISITORS</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-0 text-center space-y-1">
                                            <div className="text-2xl font-bold text-green-600">{topEvent?.label || "N/A"}</div>
                                            <p className="text-xs font-medium text-muted-foreground">EVENT CATEGORY</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {campaign?.atrafficId && (
                <>
                    {/* Visitors Country */}
                    <div className="space-y-2">
                        <CardTitle className="text-primary">Visitors Country</CardTitle>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-3/5">COUNTRY</TableHead>
                                    <TableHead className="text-center">VISITS</TableHead>
                                    <TableHead className="text-center">UNIQUE VISITORS</TableHead>
                                    <TableHead className="text-center">ACTIONS</TableHead>
                                    <TableHead className="text-center">TIME SPENT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!analytics?.country || analytics.country.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.country.filter((item: any) => item.nb_visits >= 1).map((item: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="flex items-center gap-2">
                                                <img src={`https://flagcdn.com/16x12/${item.code?.toLowerCase()}.png`} width="16" height="12" alt={item.code} className="inline-block mr-2" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                {item.label}
                                            </TableCell>
                                            <TableCell className="text-center">{item.nb_visits}</TableCell>
                                            <TableCell className="text-center">{item.sum_daily_nb_uniq_visitors}</TableCell>
                                            <TableCell className="text-center">{item.nb_actions}</TableCell>
                                            <TableCell className="text-center">{formatDuration(item.sum_visit_length)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Visitors City */}
                    <div className="space-y-2">
                        <CardTitle className="text-primary">Visitors City</CardTitle>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-3/5">CITIES</TableHead>
                                    <TableHead className="text-center">VISITS</TableHead>
                                    <TableHead className="text-center">UNIQUE VISITORS</TableHead>
                                    <TableHead className="text-center">ACTIONS</TableHead>
                                    <TableHead className="text-center">TIME SPENT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!analytics?.city || analytics.city.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.city.filter((item: any) => item.nb_visits >= 1).map((item: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell className="text-center">{item.nb_visits}</TableCell>
                                            <TableCell className="text-center">{item.sum_daily_nb_uniq_visitors}</TableCell>
                                            <TableCell className="text-center">{item.nb_actions}</TableCell>
                                            <TableCell className="text-center">{formatDuration(item.sum_visit_length)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Search Engines */}
                    <div className="space-y-2">
                        <CardTitle className="text-primary">Search Engines</CardTitle>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-3/5">SEARCH ENGINE</TableHead>
                                    <TableHead className="text-center">VISITS</TableHead>
                                    <TableHead className="text-center">UNIQUE VISITORS</TableHead>
                                    <TableHead className="text-center">ACTIONS</TableHead>
                                    <TableHead className="text-center">TIME SPENT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!analytics?.search_engines || analytics.search_engines.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.search_engines.filter((item: any) => item.nb_visits >= 1).map((item: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell className="text-center">{item.nb_visits}</TableCell>
                                            <TableCell className="text-center">{item.sum_daily_nb_uniq_visitors}</TableCell>
                                            <TableCell className="text-center">{item.nb_actions}</TableCell>
                                            <TableCell className="text-center">{formatDuration(item.sum_visit_length)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Referrer Types */}
                    <div className="space-y-2">
                        <CardTitle className="text-primary">Referrer Types</CardTitle>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-3/5">REFERRER TYPE</TableHead>
                                    <TableHead className="text-center">VISITS</TableHead>
                                    <TableHead className="text-center">ACTIONS</TableHead>
                                    <TableHead className="text-center">UNIQUE VISITORS</TableHead>
                                    <TableHead className="text-center">TIME SPENT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!analytics?.channels || analytics.channels.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.channels.filter((item: any) => item.nb_visits >= 1).map((item: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell className="text-center">{item.nb_visits}</TableCell>
                                            <TableCell className="text-center">{item.nb_actions}</TableCell>
                                            <TableCell className="text-center">{item.sum_daily_nb_uniq_visitors}</TableCell>
                                            <TableCell className="text-center">{formatDuration(item.sum_visit_length)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Visitor Device Types */}
                    <div className="space-y-2">
                        <CardTitle className="text-primary">Visitor Device Types</CardTitle>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-3/5">TYPE</TableHead>
                                    <TableHead className="text-center">VISITS</TableHead>
                                    <TableHead className="text-center">ACTIONS</TableHead>
                                    <TableHead className="text-center">UNIQUE VISITORS</TableHead>
                                    <TableHead className="text-center">TIME SPENT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!analytics?.devices || analytics.devices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No entries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.devices.filter((item: any) => item.nb_visits >= 1).map((item: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell className="text-center">{item.nb_visits}</TableCell>
                                            <TableCell className="text-center">{item.nb_actions}</TableCell>
                                            <TableCell className="text-center">{item.sum_daily_nb_uniq_visitors}</TableCell>
                                            <TableCell className="text-center">{formatDuration(item.sum_visit_length)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            {/* Build Information */}
            {campaign?.buildInfo && (
                <div className="space-y-2">
                    <CardTitle className="text-primary">BUILD INFORMATION</CardTitle>
                    <div className="space-y-1 text-sm bg-muted p-4 rounded-md">
                        <div className="whitespace-pre-wrap">{campaign.buildInfo}</div>
                    </div>
                </div>
            )}
        </div>
    )
}
