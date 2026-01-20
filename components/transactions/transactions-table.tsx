"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, MoreVertical } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { AddTransactionDialog } from "./add-transaction-dialog"
import { UpdateTransactionDialog } from "./update-transaction-dialog"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Niche, Campaign } from "@/lib/types"
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
import { format } from "date-fns"

interface ApiTransaction {
    id: number
    description: string
    nicheId: number
    campaignId: number | null
    amount: number
    transDate?: string | null
    createdAt?: string | null
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

interface EditDialogTransaction {
    id: string
    amount: string
    category: string
    callerTag: string
    description: string
    date: Date | string
    nicheId?: number
    campaignId?: number | null
}

interface TransactionsTableProps {
    dateRange: { from: Date; to: Date }
    onTransactionsChanged?: () => void
}

export function TransactionsTable({ dateRange, onTransactionsChanged }: TransactionsTableProps) {
    const [transactions, setTransactions] = useState<ApiTransaction[]>([])
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<EditDialogTransaction | null>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [nicheMap, setNicheMap] = useState<Record<number, string>>({})
    const [campaignMap, setCampaignMap] = useState<Record<number, string>>({})
    const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false)
    const [transactionToDelete, setTransactionToDelete] = useState<ApiTransaction | null>(null)
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

    const fetchLookups = useCallback(async () => {
        try {
            const [nichesRes, campaignsRes] = await Promise.all([
                api.get<NichesResponse>("/niches?limit=1000"),
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
        } catch (error) {
            console.error("Failed to fetch lookup data:", error)
        }
    }, [])

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const startDateStr = encodeURIComponent(format(dateRange.from, "yyyy-MM-dd"))
            const endDateStr = encodeURIComponent(format(dateRange.to, "yyyy-MM-dd"))

            const response = await api.get<TransactionsResponse>(
                `/transactions?page=${currentPage}&limit=${entriesPerPage}&startDate=${startDateStr}&endDate=${endDateStr}`
            )

            setTransactions(response.transactions)
            setTotalEntries(response.total)
            setSelectedIds([])
        } catch (err) {
            console.error("Failed to fetch transactions:", err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to load transactions")
            }
        } finally {
            setLoading(false)
        }
    }, [currentPage, entriesPerPage, dateRange.from, dateRange.to])

    useEffect(() => {
        fetchLookups()
    }, [fetchLookups])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    const formatDate = (transDate?: string | null, createdAt?: string | null) => {
        const raw = transDate || createdAt
        if (!raw) return "-"
        const date = new Date(raw)
        if (isNaN(date.getTime())) return "-"
        return format(date, "do MMMM yyyy")
    }

    const allSelected = transactions.length > 0 && selectedIds.length === transactions.length
    const someSelected = selectedIds.length > 0 && selectedIds.length < transactions.length

    const toggleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelectedIds(transactions.map((t) => t.id))
        } else {
            setSelectedIds([])
        }
    }

    const toggleSelectOne = (id: number, checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
        } else {
            setSelectedIds((prev) => prev.filter((x) => x !== id))
        }
    }

    const handleEdit = (transaction: ApiTransaction) => {
        setSelectedTransaction({
            id: String(transaction.id),
            amount: transaction.amount.toFixed(2),
            category: nicheMap[transaction.nicheId] || String(transaction.nicheId),
            callerTag: transaction.campaignId ? campaignMap[transaction.campaignId] || String(transaction.campaignId) : "",
            description: transaction.description,
            date: transaction.transDate || transaction.createdAt || "",
            nicheId: transaction.nicheId,
            campaignId: transaction.campaignId,
        })
        setIsUpdateDialogOpen(true)
    }

    const openSingleDeleteDialog = (transaction: ApiTransaction) => {
        setTransactionToDelete(transaction)
        setSingleDeleteDialogOpen(true)
    }

    const handleSingleDelete = async () => {
        if (!transactionToDelete) return
        try {
            await api.delete(`/transactions/${transactionToDelete.id}`)
            setSingleDeleteDialogOpen(false)
            setTransactionToDelete(null)
            fetchTransactions()
        } catch (error) {
            console.error("Failed to delete transaction:", error)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        try {
            await Promise.all(selectedIds.map((id) => api.delete(`/transactions/${id}`)))
            setBulkDeleteDialogOpen(false)
            setSelectedIds([])
            fetchTransactions()
        } catch (error) {
            console.error("Failed to delete transactions:", error)
        }
    }

    const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / parseInt(entriesPerPage))

    const fromEntry =
        totalEntries === 0 ? 0 : (currentPage - 1) * parseInt(entriesPerPage, 10) + (transactions.length > 0 ? 1 : 0)
    const toEntry = Math.min(currentPage * parseInt(entriesPerPage, 10), totalEntries)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-orange-500 font-medium">Transaction Logs</h3>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                    Add New
                </Button>
            </div>

            <Card>
                <CardContent className="p-6 pt-0">
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
                        <Input placeholder="Search..." className="max-w-xs" />
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="w-12 text-center">
                                        <Checkbox
                                            checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                            onCheckedChange={toggleSelectAll}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Niche</TableHead>
                                    <TableHead>Campaign Tag</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <TableRow key={i}>
                                            {[...Array(7)].map((_, j) => (
                                                <TableCell key={j} className="h-10">
                                                    <Skeleton className="h-6 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-red-500">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((row) => {
                                        const isSelected = selectedIds.includes(row.id)
                                        const nicheName = nicheMap[row.nicheId] || row.nicheId
                                        const campaignName =
                                            row.campaignId && campaignMap[row.campaignId]
                                                ? campaignMap[row.campaignId]
                                                : row.campaignId

                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => toggleSelectOne(row.id, checked)}
                                                        aria-label="Select transaction"
                                                    />
                                                </TableCell>
                                                <TableCell>${row.amount.toFixed(2)}</TableCell>
                                                <TableCell>{nicheName}</TableCell>
                                                <TableCell>
                                                    {campaignName ? (
                                                        <span className="px-3 py-1 rounded text-xs font-medium text-white whitespace-nowrap bg-orange-400">
                                                            {campaignName}
                                                        </span>
                                                    ) : (
                                                        " "
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-[260px] truncate" title={row.description}>
                                                    {row.description}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(row.transDate ?? null, row.createdAt ?? null)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(row)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openSingleDeleteDialog(row)}>
                                                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                                <span className="text-red-500">Delete</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                Showing {fromEntry} to {toEntry} of {totalEntries} entries
                            </span>
                            {selectedIds.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setBulkDeleteDialogOpen(true)}
                                    className="flex items-center gap-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete All ({selectedIds.length})
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || loading}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-500">
                                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        prev * parseInt(entriesPerPage, 10) >= totalEntries ? prev : prev + 1
                                    )
                                }
                                disabled={currentPage * parseInt(entriesPerPage, 10) >= totalEntries || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AddTransactionDialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    if (!open) {
                        fetchTransactions()
                    }
                }}
                onSuccess={onTransactionsChanged}
            />

            <UpdateTransactionDialog
                open={isUpdateDialogOpen}
                onOpenChange={(open) => {
                    setIsUpdateDialogOpen(open)
                    if (!open) {
                        fetchTransactions()
                    }
                }}
                transaction={selectedTransaction}
                onSuccess={onTransactionsChanged}
            />

            <AlertDialog
                open={singleDeleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setSingleDeleteDialogOpen(false)
                        setTransactionToDelete(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the transaction{" "}
                            <span className="font-semibold text-foreground">{transactionToDelete?.description}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleSingleDelete}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={bulkDeleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setBulkDeleteDialogOpen(false)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete selected transactions?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete{" "}
                            <span className="font-semibold text-foreground">{selectedIds.length}</span> selected
                            transaction(s).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleBulkDelete}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
