"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface ElocalCampaign {
    id: number
    campaign: string
    phone: string
    total: number
    unique: number
    converted: number
    value: number
    date: string | null
}

interface ElocalCampaignsResponse {
    campaigns: ElocalCampaign[]
}

interface DateRange {
    from: Date
    to: Date
}

interface CampaignsTableProps {
    dateRange: DateRange
}

export function CampaignsTable({ dateRange }: CampaignsTableProps) {
    const [campaigns, setCampaigns] = useState<ElocalCampaign[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "-"
        return format(date, "MMM dd, yyyy HH:mm:ss aa")
    }

    const fetchCampaigns = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append("limit", "7")
            if (dateRange.from) {
                params.append("startDate", format(dateRange.from, "yyyy-MM-dd"))
            }
            if (dateRange.to) {
                params.append("endDate", format(dateRange.to, "yyyy-MM-dd"))
            }
            const query = params.toString() ? `?${params.toString()}` : ""
            const data = await api.get<ElocalCampaignsResponse>(`/elocal/campaigns${query}`)
            setCampaigns(data.campaigns || [])
            setError(null)
        } catch (err) {
            console.error("Elocal campaigns error:", err)
            setError(err instanceof Error ? err.message : "Failed to load campaigns")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [dateRange.from, dateRange.to])

    return (
        <div className="space-y-4">
            <h3 className="text-orange-500 font-medium">My Campaigns</h3>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="pl-4">Campaign</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead className="text-center">Total Calls</TableHead>
                            <TableHead className="text-center">Unique</TableHead>
                            <TableHead className="text-center">Converted</TableHead>
                            <TableHead className="text-center">Total Call Value</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(3)].map((_, index) => (
                                <TableRow key={index}>
                                    {[...Array(7)].map((__, cellIndex) => (
                                        <TableCell key={cellIndex} className="h-10">
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : campaigns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-sm text-muted-foreground">
                                    {error ? "Failed to load campaigns" : "No campaigns to display"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            campaigns.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="pl-4">{row.campaign}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell className="text-center">{row.total}</TableCell>
                                    <TableCell className="text-center">{row.unique}</TableCell>
                                    <TableCell className="text-center">{row.converted}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
                                            ${row.value.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(row.date)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end pt-4">
                <Link href="/elocal-reports">
                    <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                        View Reports
                    </Button>
                </Link>
            </div>
        </div>
    )
}
