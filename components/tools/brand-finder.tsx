"use client"

import * as React from "react"
import { AlertCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface Backlink {
    domain: string
    title: string
    url: string
    snippet?: string
}

interface BrandFinderResult {
    backlinks: Backlink[]
    count: number
    domain: string
    brand_name: string
    max_pages: number
}

export function BrandFinderTool() {
    const [domain, setDomain] = React.useState("")
    const [brandName, setBrandName] = React.useState("")
    const [maxPages, setMaxPages] = React.useState<string>("1")
    const [backlinks, setBacklinks] = React.useState<Backlink[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [entriesPerPage, setEntriesPerPage] = React.useState<string>("10")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSearch = async () => {
        if (!domain || loading) return
        try {
            setLoading(true)
            setError(null)
            setBacklinks([])
            setCurrentPage(1)

            const payload = {
                domain,
                brand_name: brandName || domain,
                max_pages: Number(maxPages) || 1,
            }

            const data = await api.post<BrandFinderResult>("/tools/brand-finder", payload)
            setBacklinks(data.backlinks || [])
        } catch (err) {
            setBacklinks([])
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to fetch backlinks")
            }
        } finally {
            setLoading(false)
        }
    }

    const filteredBacklinks = backlinks.filter((backlink) => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return (
            backlink.domain.toLowerCase().includes(term) ||
            backlink.title.toLowerCase().includes(term) ||
            backlink.url.toLowerCase().includes(term)
        )
    })

    const pageSize = Number(entriesPerPage) || 10
    const totalEntries = filteredBacklinks.length
    const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalEntries)
    const pageItems = filteredBacklinks.slice(startIndex, endIndex)

    const hasResults = totalEntries > 0

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter domain... e.g: domain.com"
                        className="w-[300px]"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />

                    <Input
                        type="text"
                        placeholder="Brand name (optional)..."
                        className="w-[200px]"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                    />

                    <Select
                        value={maxPages}
                        onValueChange={setMaxPages}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Max Pages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="bg-primary hover:bg-primary/90 cursor-pointer"
                        onClick={handleSearch}
                        disabled={loading || !domain}
                    >
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>
            </div>

            {/* {!loading && !hasResults && !error && (
                <div className="py-2">
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            <p>
                                Oh snap!, please there are no backlinks for this competitor yet. Come back later!
                            </p>
                        </AlertDescription>
                    </Alert>
                </div>
            )} */}

            {error && (
                <div className="py-2">
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            <p>{error}</p>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="p-0 pt-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Select
                            value={entriesPerPage}
                            onValueChange={(value) => {
                                setEntriesPerPage(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[70px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-foreground/70">entries per page</span>
                    </div>

                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] h-9"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>

                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>URLs</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(3)].map((_, j) => (
                                            <TableCell key={j} className="h-10">
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                            {!loading && hasResults && pageItems.map((backlink) => (
                                <TableRow key={backlink.url}>
                                    <TableCell>{backlink.domain}</TableCell>
                                    <TableCell className="break-words whitespace-normal">
                                        {backlink.title}
                                    </TableCell>
                                    <TableCell className="break-words whitespace-normal">
                                        <a
                                            href={backlink.url}
                                            className="text-blue-500 hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {backlink.url}
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && !hasResults && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-20 text-center text-sm text-foreground/60"
                                    >
                                        No backlinks found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-foreground/70 mt-4">
                    <div>
                        {totalEntries > 0
                            ? <>Showing {startIndex + 1} to {endIndex} of {totalEntries} entries</>
                            : <>Showing 0 to 0 of 0 entries</>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safeCurrentPage === 1 || loading}
                            className="cursor-pointer"
                        >
                            Previous
                        </Button>
                        <span>
                            Page {safeCurrentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safeCurrentPage >= totalPages || loading}
                            className="cursor-pointer"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
