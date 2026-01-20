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
import { Phone, PhoneMissed, ThumbsUp, HelpCircle, Trash2, MoreVertical, Pencil } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api-client"
import { format } from "date-fns"
import { UpdateCallDialog } from "./update-call-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ElocalCall {
    id: number
    phoneNumber: string
    callerNumber: string
    duration: number
    callDate: string
    location?: string | null
    nicheId: number
    nicheName?: string | null
    payout: number
    sold: boolean
    status: boolean
}

interface CallsResponse {
    calls: ElocalCall[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

interface DateRange {
    from: Date
    to: Date
}

interface ReportsTableProps {
    dateRange: DateRange
    nicheId?: string
    onCallsChanged?: () => void
}

export function ReportsTable({ dateRange, nicheId, onCallsChanged }: ReportsTableProps) {
    const [calls, setCalls] = useState<ElocalCall[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedCall, setSelectedCall] = useState<ElocalCall | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [callToDelete, setCallToDelete] = useState<ElocalCall | null>(null)

    const parseLimit = () => {
        const parsed = parseInt(entriesPerPage, 10)
        return Number.isNaN(parsed) ? 10 : parsed
    }

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "")
        if (digits.length === 10) {
            const area = digits.slice(0, 3)
            const prefix = digits.slice(3, 6)
            const line = digits.slice(6)
            return `(${area}) ${prefix}-${line}`
        }
        return value
    }

    const formatDateTime = (iso: string | null | undefined) => {
        if (!iso) return "-"
        const date = new Date(iso)
        if (Number.isNaN(date.getTime())) return "-"
        return format(date, "MM/dd/yy h:mm a")
    }

    const fetchCalls = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams()
            params.append("page", currentPage.toString())
            params.append("limit", parseLimit().toString())
            if (searchQuery.trim()) {
                params.append("search", searchQuery.trim())
            }
            if (dateRange.from) {
                params.append("startDate", format(dateRange.from, "yyyy-MM-dd"))
            }
            if (dateRange.to) {
                params.append("endDate", format(dateRange.to, "yyyy-MM-dd"))
            }
            if (nicheId) {
                params.append("nicheId", nicheId)
            }

            const query = params.toString() ? `?${params.toString()}` : ""
            const response = await api.get<CallsResponse>(`/elocal/calls${query}`)

            setCalls(response.calls)
            setTotalEntries(response.total)
            setTotalPages(response.pages || 1)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to load call logs")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCalls()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, entriesPerPage, searchQuery, dateRange.from, dateRange.to, nicheId])

    const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * parseLimit() + 1
    const endEntry = Math.min(currentPage * parseLimit(), totalEntries)

    return (
        <div className="space-y-4">
            <h3 className="text-orange-500 font-medium">Call Logs</h3>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Select
                                value={entriesPerPage}
                                onValueChange={(value) => {
                                    setEntriesPerPage(value)
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
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
                            onChange={(event) => {
                                setSearchQuery(event.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Caller</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Payout</TableHead>
                                    <TableHead className="text-center">Sold</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {Array.from({ length: 10 }).map((__, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-24 text-center text-destructive">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : calls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                                            No call logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    calls.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="text-center">
                                                {row.status ? (
                                                    <Phone className="h-4 w-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <PhoneMissed className="h-4 w-4 text-red-500 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="bg-teal-700 text-white px-2 py-1 rounded text-xs font-medium">
                                                    {row.nicheName || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {formatPhone(row.phoneNumber)}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {formatPhone(row.callerNumber)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {row.duration}s
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {row.location || " "}
                                            </TableCell>
                                            <TableCell className="text-sm whitespace-nowrap">
                                                {formatDateTime(row.callDate)}
                                            </TableCell>
                                            <TableCell>
                                                {row.payout > 0 && (
                                                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                                        {row.payout.toLocaleString("en-US", {
                                                            style: "currency",
                                                            currency: "USD",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {row.sold ? (
                                                    <ThumbsUp className="h-4 w-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <HelpCircle className="h-4 w-4 text-gray-400 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedCall(row)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setCallToDelete(row)
                                                                setDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                                {totalEntries === 0
                                    ? "Showing 0 entries"
                                    : `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1 || loading}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-500">
                                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages || loading}
                                onClick={() =>
                                    setCurrentPage((page) => (totalPages === 0 ? page : Math.min(totalPages, page + 1)))
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UpdateCallDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) {
                        setSelectedCall(null)
                        fetchCalls()
                    }
                }}
                call={
                    selectedCall
                        ? {
                              id: selectedCall.id,
                              callerNumber: formatPhone(selectedCall.callerNumber),
                              payout: selectedCall.payout,
                              sold: selectedCall.sold,
                          }
                        : undefined
                }
                onUpdated={() => {
                    fetchCalls()
                    if (onCallsChanged) {
                        onCallsChanged()
                    }
                }}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteDialogOpen(false)
                        setCallToDelete(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete call log?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the call log for{" "}
                            <span className="font-semibold text-foreground">
                                {callToDelete ? formatPhone(callToDelete.callerNumber) : ""}
                            </span>
                            .
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={async () => {
                                if (!callToDelete) return
                                try {
                                    await api.delete(`/elocal/calls/${callToDelete.id}`)
                                    setDeleteDialogOpen(false)
                                    setCallToDelete(null)
                                    fetchCalls()
                                    if (onCallsChanged) {
                                        onCallsChanged()
                                    }
                                } catch (error) {
                                    console.error("Failed to delete call:", error)
                                }
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
