"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ElocalPriceItem {
    zip_code: string
    city_name: string
    state_abbr: string
    max_call_price: number
}

interface CachedPriceList {
    items: ElocalPriceItem[]
    timestamp: number
}

interface RevShareTableProps {
    categoryId: string | null
    version: string | null
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const REVSHARE_RATE = 0.5

const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

export function RevShareTable({ categoryId, version }: RevShareTableProps) {
    const [items, setItems] = useState<ElocalPriceItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (!categoryId || !version) {
            setItems([])
            setError(null)
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const cacheKey = `elocal-price-list-${categoryId}-${version}`

                if (typeof window !== "undefined") {
                    const cached = localStorage.getItem(cacheKey)
                    if (cached) {
                        try {
                            const parsed: CachedPriceList = JSON.parse(cached)
                            if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                                setItems(parsed.items)
                                setLoading(false)
                                return
                            }
                        } catch {
                        }
                    }
                }

                const apiKey = process.env.NEXT_PUBLIC_ELOCAL_REVSHARE_KEY || process.env.ELOCAL_REVSHARE_KEY

                if (!apiKey) {
                    setError("Missing eLocal API key configuration.")
                    setItems([])
                    setLoading(false)
                    return
                }

                const url = `https://www.elocal.com/api/call_category_price_list/${encodeURIComponent(
                    categoryId,
                )}.json?api_key=${encodeURIComponent(apiKey)}&version=${encodeURIComponent(version)}`

                const response = await fetch(url)

                if (!response.ok) {
                    setError(`Failed to load price list (${response.status})`)
                    setItems([])
                    return
                }

                const data = (await response.json()) as ElocalPriceItem[]

                setItems(data)

                if (typeof window !== "undefined") {
                    const payload: CachedPriceList = {
                        items: data,
                        timestamp: Date.now(),
                    }
                    localStorage.setItem(cacheKey, JSON.stringify(payload))
                }
            } catch (err) {
                console.error("Failed to fetch eLocal price list:", err)
                setError("Failed to load price list.")
                setItems([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [categoryId, version])

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return items
        return items.filter((item) => {
            const city = item.city_name?.toLowerCase() ?? ""
            const state = item.state_abbr?.toLowerCase() ?? ""
            return (
                city.includes(query) ||
                state.includes(query) ||
                item.zip_code.includes(query)
            )
        })
    }, [items, searchQuery])

    const rows = useMemo(
        () =>
            filteredItems.map((item) => {
                const maxPrice = item.max_call_price
                const revShare = maxPrice * REVSHARE_RATE
                const daily = revShare * 1
                const weekly = revShare * 7
                const monthly = revShare * 30
                const yearly = revShare * 365

                return {
                    city: item.city_name,
                    state: item.state_abbr,
                    zipcode: item.zip_code,
                    maxPrice: formatCurrency(maxPrice),
                    revShare: formatCurrency(revShare),
                    daily: formatCurrency(daily),
                    weekly: formatCurrency(weekly),
                    monthly: formatCurrency(monthly),
                    yearly: formatCurrency(yearly),
                }
            }),
        [filteredItems],
    )

    const totalEntries = rows.length
    const perPage = parseInt(entriesPerPage) || 10
    const totalPages = totalEntries === 0 ? 1 : Math.ceil(totalEntries / perPage)

    const paginatedRows = useMemo(() => {
        if (totalEntries === 0) return []
        const start = (currentPage - 1) * perPage
        const end = start + perPage
        return rows.slice(start, end)
    }, [rows, currentPage, perPage, totalEntries])

    const startIndex = totalEntries === 0 ? 0 : (currentPage - 1) * perPage + 1
    const endIndex = totalEntries === 0 ? 0 : Math.min(currentPage * perPage, totalEntries)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Select
                        value={entriesPerPage}
                        onValueChange={(value) => {
                            setEntriesPerPage(value)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries per page</span>
                </div>

                <div className="relative w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by city, state, or zipcode..."
                        className="pl-8 w-full"
                        value={searchQuery}
                        onChange={(event) => {
                            setSearchQuery(event.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
            </div>
        
            {error && (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            )}
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[280px] pl-4">City</TableHead>
                            <TableHead className="w-[100px]">State</TableHead>
                            <TableHead className="w-[100px]">Zipcode</TableHead>
                            <TableHead className="w-[120px]">
                                <div className="flex items-center gap-1 cursor-pointer">
                                    Max Price
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="w-[120px]">RevShare</TableHead>
                            <TableHead className="text-center">Daily</TableHead>
                            <TableHead className="text-center">Weekly</TableHead>
                            <TableHead className="text-center">Monthly</TableHead>
                            <TableHead className="text-center">Yearly</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(9)].map((_, j) => (
                                        <TableCell key={j} className="h-10">
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    {!categoryId || !version
                                        ? "Select a category and version to load price list."
                                        : "No results found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedRows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium pl-4">{row.city}</TableCell>
                                    <TableCell>{row.state}</TableCell>
                                    <TableCell>{row.zipcode}</TableCell>
                                    <TableCell>{row.maxPrice}</TableCell>
                                    <TableCell>{row.revShare}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded cursor-pointer transition-colors inline-block min-w-[60px]">
                                            {row.daily}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded cursor-pointer transition-colors inline-block min-w-[70px]">
                                            {row.weekly}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded cursor-pointer transition-colors inline-block min-w-[80px]">
                                            {row.monthly}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded cursor-pointer transition-colors inline-block min-w-[90px]">
                                            {row.yearly}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-2 text-sm text-gray-500">
                <div>
                    {totalEntries > 0
                        ? `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`
                        : "No entries to display"}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-auto disabled:opacity-50"
                        disabled={currentPage === 1 || loading || totalEntries === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </Button>
                    <span className="px-2">
                        Page {totalEntries === 0 ? 0 : currentPage} of {totalEntries === 0 ? 0 : totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-auto disabled:opacity-50"
                        disabled={currentPage >= totalPages || loading || totalEntries === 0}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
