"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Niche, Campaign } from "@/lib/types"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface ApiTransaction {
    id: number
    description: string
    nicheId: number
    campaignId: number | null
    amount: number
    createdAt: string | null
    updatedAt?: string | null
}

interface TransactionsResponse {
    transactions: ApiTransaction[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

interface NichesResponse {
    niches: Niche[]
    total: number
}

interface CampaignsResponse {
    campaigns: Campaign[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

interface CampaignNicheRow {
    campaignId: number | null
    nicheId: number
    monthlyTotals: number[]
    yearTotal: number
}

type SortDirection = "asc" | "desc"

interface SortState {
    column: string
    direction: SortDirection
}

interface EarningsTableProps {
    dateRange: { from: Date; to: Date }
}

export function EarningsTable({ dateRange }: EarningsTableProps) {
    const [rows, setRows] = useState<CampaignNicheRow[]>([])
    const [monthlyTotals, setMonthlyTotals] = useState<number[]>(() => Array(12).fill(0))
    const [grandTotal, setGrandTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [nicheMap, setNicheMap] = useState<Record<number, string>>({})
    const [campaignMap, setCampaignMap] = useState<Record<number, string>>({})
    const [sortState, setSortState] = useState<SortState>({ column: "yearTotal", direction: "desc" })

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [nichesRes, campaignsRes] = await Promise.all([
                    api.get<NichesResponse>("/niches?limit=1000&status=true"),
                    api.get<CampaignsResponse>("/campaigns?limit=1000"),
                ])

                const nMap: Record<number, string> = {}
                nichesRes.niches.forEach((niche) => {
                    nMap[niche.id] = niche.name
                })
                setNicheMap(nMap)

                const cMap: Record<number, string> = {}
                campaignsRes.campaigns.forEach((campaign) => {
                    cMap[campaign.id] = campaign.name
                })
                setCampaignMap(cMap)
            } catch (err) {
                console.error("Failed to fetch lookup data:", err)
            }
        }

        fetchLookups()
    }, [])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true)
                setError(null)

                const currentYear = dateRange.from.getFullYear()
                const startDate = new Date(currentYear, 0, 1).toISOString()
                const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999).toISOString()

                const response = await api.get<TransactionsResponse>(
                    `/transactions?page=1&limit=1000&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
                        endDate
                    )}&sortBy=created_at&sortOrder=asc`
                )

                const groupMap = new Map<string, CampaignNicheRow>()

                for (const tx of response.transactions) {
                    if (!tx.createdAt) continue
                    const date = new Date(tx.createdAt)
                    if (isNaN(date.getTime())) continue
                    if (date.getFullYear() !== currentYear) continue

                    const monthIndex = date.getMonth()
                    if (monthIndex < 0 || monthIndex > 11) continue

                    const key = `${tx.campaignId ?? "none"}-${tx.nicheId}`
                    let row = groupMap.get(key)

                    if (!row) {
                        row = {
                            campaignId: tx.campaignId ?? null,
                            nicheId: tx.nicheId,
                            monthlyTotals: Array(12).fill(0),
                            yearTotal: 0,
                        }
                        groupMap.set(key, row)
                    }

                    row.monthlyTotals[monthIndex] += tx.amount
                    row.yearTotal += tx.amount
                }

                const aggregatedRows = Array.from(groupMap.values())
                const totals = Array(12).fill(0)
                let grand = 0

                for (const row of aggregatedRows) {
                    row.monthlyTotals.forEach((value, index) => {
                        totals[index] += value
                    })
                    grand += row.yearTotal
                }

                setRows(aggregatedRows)
                setMonthlyTotals(totals)
                setGrandTotal(grand)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Failed to load campaign revenue")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [dateRange.from, dateRange.to])

    const handleSort = (column: string) => {
        setSortState((prev) => {
            if (prev.column === column) {
                return {
                    column,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                }
            }

            return {
                column,
                direction: "desc",
            }
        })
    }

    const getCampaignNicheLabel = (row: CampaignNicheRow) => {
        if (row.campaignId && campaignMap[row.campaignId]) {
            return campaignMap[row.campaignId]
        }

        if (nicheMap[row.nicheId]) {
            return nicheMap[row.nicheId]
        }

        if (row.campaignId) {
            return String(row.campaignId)
        }

        return String(row.nicheId)
    }

    const sortedRows = useMemo(() => {
        const data = [...rows]

        data.sort((a, b) => {
            const { column, direction } = sortState
            let aValue = 0
            let bValue = 0

            if (column === "entity") {
                const aLabel = getCampaignNicheLabel(a).toLowerCase()
                const bLabel = getCampaignNicheLabel(b).toLowerCase()

                if (aLabel < bLabel) return direction === "asc" ? -1 : 1
                if (aLabel > bLabel) return direction === "asc" ? 1 : -1
                return 0
            } else if (column === "yearTotal") {
                aValue = a.yearTotal
                bValue = b.yearTotal
            } else if (column === "yearTotal") {
                aValue = a.yearTotal
                bValue = b.yearTotal
            } else if (column.startsWith("month-")) {
                const index = parseInt(column.split("-")[1] ?? "0", 10)
                aValue = a.monthlyTotals[index] ?? 0
                bValue = b.monthlyTotals[index] ?? 0
            }

            if (aValue < bValue) return direction === "asc" ? -1 : 1
            if (aValue > bValue) return direction === "asc" ? 1 : -1
            return 0
        })

        return data
    }, [rows, sortState])

    const renderSortIndicator = (column: string) => {
        if (sortState.column !== column) return null
        return sortState.direction === "asc" ? " ↑" : " ↓"
    }

    const currentYear = dateRange.from.getFullYear()
    const columnCount = 1 + months.length + 1

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-orange-500">Campaign Revenue - ({currentYear})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead
                                    className="w-[180px] font-bold cursor-pointer select-none"
                                    onClick={() => handleSort("entity")}
                                >
                                    Campaign/Niche
                                    {renderSortIndicator("entity")}
                                </TableHead>
                                {months.map((m, index) => (
                                    <TableHead
                                        key={m}
                                        className="text-center font-bold px-2 cursor-pointer select-none"
                                        onClick={() => handleSort(`month-${index}`)}
                                    >
                                        {m}
                                        {renderSortIndicator(`month-${index}`)}
                                    </TableHead>
                                ))}
                                <TableHead
                                    className="text-center font-bold cursor-pointer select-none"
                                    onClick={() => handleSort("yearTotal")}
                                >
                                    Year ($)
                                    {renderSortIndicator("yearTotal")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(columnCount)].map((_, j) => (
                                            <TableCell key={j} className="h-10">
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columnCount}
                                        className="text-center h-24 text-red-500"
                                    >
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columnCount}
                                        className="text-center h-24 text-muted-foreground"
                                    >
                                        No transactions found for the current year
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {sortedRows.map((row, index) => (
                                        <TableRow
                                            key={`${row.campaignId ?? "none"}-${row.nicheId}-${index}`}
                                        >
                                            <TableCell className="font-medium text-xs text-muted-foreground">
                                                {getCampaignNicheLabel(row)}
                                            </TableCell>
                                            {row.monthlyTotals.map((value, idx) => (
                                                <TableCell
                                                    key={idx}
                                                    className="text-center text-xs text-muted-foreground px-2"
                                                >
                                                    ${value.toFixed(2)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center px-1">
                                                <Badge className="bg-orange-400 hover:bg-orange-500 text-black border-0 rounded-sm font-normal px-2">
                                                    ${row.yearTotal.toFixed(2)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/10 font-bold hover:bg-muted/10">
                                        <TableCell>Total</TableCell>
                                        {monthlyTotals.map((value, idx) => (
                                            <TableCell key={idx} className="text-center px-1">
                                                {value > 0 ? (
                                                    <Badge className="bg-orange-400 hover:bg-orange-500 text-black border-0 rounded-sm font-normal px-2 w-full justify-center">
                                                        ${value.toFixed(2)}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-sm font-normal px-2 w-full justify-center"
                                                    >
                                                        ${value.toFixed(2)}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-center px-1">
                                            <Badge className="bg-green-700 hover:bg-green-600 text-white border-0 rounded-sm font-normal px-2">
                                                ${grandTotal.toFixed(2)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    <Link href={`/transactions`}>
                        <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                            View Transactions
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
