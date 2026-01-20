"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Niche as BaseNiche } from "@/lib/types"
import { format } from "date-fns"

interface CategoryNiche extends BaseNiche {
    elocalName?: string
    phoneNumber?: string
    categoryId?: string | number
    createdAt?: string
    totalCalls?: number
    uniqueCalls?: number
    convertedCalls?: number
}

interface NichesResponse {
    niches: CategoryNiche[]
}

interface CategoryStats {
    nicheId: number
    totalCalls: number
    uniqueCalls: number
    convertedCalls: number
}

export function ElocalCategoriesTable() {
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [categories, setCategories] = useState<CategoryNiche[]>([])
    const [categoryStats, setCategoryStats] = useState<Record<number, CategoryStats>>({})
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const formatCreatedAt = (dateString?: string) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "-"
        return format(date, "do MMMM, yyyy")
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const [nichesResponse, statsResponse] = await Promise.all([
                    api.get<NichesResponse>("/niches?limit=1000&status=true"),
                    api.get<{ stats: CategoryStats[] }>("/elocal/category-stats"),
                ])

                setCategories(nichesResponse.niches)

                const statsMap: Record<number, CategoryStats> = {}
                for (const stat of statsResponse.stats || []) {
                    if (stat && typeof stat.nicheId === "number") {
                        statsMap[stat.nicheId] = stat
                    }
                }
                setCategoryStats(statsMap)
            } catch (error) {
                console.error("Failed to fetch eLocal categories:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const filteredCategories = categories.filter((category) => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return true

        const name = (category.elocalName || category.name || "").toLowerCase()
        const phone = (category.phoneNumber || "").toLowerCase()
        const categoryId = category.categoryId != null ? String(category.categoryId) : ""

        return (
            name.includes(query) ||
            phone.includes(query) ||
            categoryId.includes(query)
        )
    })

    return (
        <div className="space-y-4">
            <h3 className="text-orange-500 font-medium text-lg flex items-center gap-2 mb-6">
                Categories
            </h3>
            <Card>
                <CardContent className="p-6 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-500">entries per page</span>
                        </div>
                        <Input
                            placeholder="Search..."
                            className="max-w-xs"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Categroy ID</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead className="text-center">No. of Calls</TableHead>
                                    <TableHead className="text-center">Unique</TableHead>
                                    <TableHead className="text-center">Converted</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(8)].map((_, j) => (
                                        <TableCell key={j} className="h-10">
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            filteredCategories.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium">
                                        {row.elocalName || row.name}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {row.categoryId ?? ""}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {row.phoneNumber || ""}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {categoryStats[row.id]?.totalCalls ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {categoryStats[row.id]?.uniqueCalls ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {categoryStats[row.id]?.convertedCalls ?? 0}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatCreatedAt(row.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-3 py-1 rounded text-xs font-bold text-white ${row.status ? "bg-green-700" : "bg-red-600"}`}>
                                            {row.status ? "Active" : "Disabled"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {filteredCategories.length > 0
                                    ? `Showing 1 to ${filteredCategories.length} of ${filteredCategories.length} entries`
                                    : "No entries to display"}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8 text-orange-500 bg-orange-50 border-orange-100 hover:bg-orange-100">1</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
