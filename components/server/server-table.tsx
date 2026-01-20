"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Pencil, MoreVertical } from "lucide-react"
import { AddServerDialog } from "./add-server-dialog"
import { UpdateServerDialog } from "./update-server-dialog"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Server as BaseServer } from "@/lib/types"
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
import { format, differenceInCalendarDays } from "date-fns"

interface ApiServer extends BaseServer {
    registrationDate?: string
    expiringDate?: string
    cost: number
    duration: string
    note?: string
    createdAt?: string
    updatedAt?: string
}

interface ServersResponse {
    servers: ApiServer[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export function ServerTable() {
    const [servers, setServers] = useState<ApiServer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [statusFilter, setStatusFilter] = useState<"active" | "cancelled">("active")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedServer, setSelectedServer] = useState<ApiServer | undefined>()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [serverToDelete, setServerToDelete] = useState<ApiServer | undefined>()

    const fetchServers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await api.get<ServersResponse>(
                `/servers?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}&status=${statusFilter === "active" ? "true" : "false"}`
            )
            setServers(response.servers)
            setTotalEntries(response.total)
        } catch (error) {
            console.error("Failed to fetch servers:", error)
        } finally {
            setLoading(false)
        }
    }, [currentPage, entriesPerPage, searchQuery, statusFilter])

    useEffect(() => {
        fetchServers()
    }, [fetchServers])

    const filteredServers = servers.filter((server) =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.ip.includes(searchQuery)
    )

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "-"
        return format(date, "do MMMM, yyyy")
    }

    const formatDaysToExpire = (dateString?: string) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "-"
        const diff = differenceInCalendarDays(date, new Date())
        if (diff < 0) return "Expired"
        return `${diff} Days`
    }

    const formatDurationLabel = (duration?: string) => {
        const value = (duration || "").toLowerCase()
        if (value === "monthly") return "Monthly"
        if (value === "quarterly") return "Quarterly"
        if (value === "semi-annually") return "Semi Annually"
        if (value === "yearly") return "Yearly"
        return duration || "-"
    }

    const handleDelete = async () => {
        if (!serverToDelete) return
        try {
            await api.delete(`/servers/${serverToDelete.id}`)
            setDeleteDialogOpen(false)
            setServerToDelete(undefined)
            fetchServers()
        } catch (error) {
            console.error("Failed to delete server:", error)
        }
    }

    const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / parseInt(entriesPerPage))

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-primary">Server Manager</CardTitle>
                </div>
                <Button
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Add New
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Select
                            value={entriesPerPage}
                            onValueChange={(val) => {
                                setEntriesPerPage(val)
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
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-xs"
                    />
                </div>

                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox />
                                </TableHead>
                                <TableHead>Server Name</TableHead>
                                <TableHead>Server IP</TableHead>
                                <TableHead>Registered Date</TableHead>
                                <TableHead>Expiring Date</TableHead>
                                <TableHead>Days to Expire</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(10)].map((_, j) => (
                                            <TableCell key={j} className="h-10">
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : filteredServers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
                                        No servers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredServers.map((server) => (
                                    <TableRow key={server.id}>
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell className="font-medium">{server.name}</TableCell>
                                        <TableCell>{server.ip}</TableCell>
                                        <TableCell>{formatDate(server.registrationDate)}</TableCell>
                                        <TableCell>{formatDate(server.expiringDate)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDaysToExpire(server.expiringDate)}
                                        </TableCell>
                                        <TableCell>
                                            ${server.cost.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-gray-800 hover:bg-gray-900 border-0">
                                                {formatDurationLabel(server.duration)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={server.status ? "bg-green-700 hover:bg-green-600 border-0" : "bg-red-600 hover:bg-red-500 border-0"}>
                                                {server.status ? "Active" : "Cancelled"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedServer(server)
                                                            setIsUpdateDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setServerToDelete(server)
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

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * parseInt(entriesPerPage) + (filteredServers.length > 0 ? 1 : 0)} to{" "}
                            {Math.min(currentPage * parseInt(entriesPerPage), totalEntries)} of {totalEntries} entries
                        </p>
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
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage * parseInt(entriesPerPage) >= totalEntries || loading}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <Button
                        variant={statusFilter === "active" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                            setStatusFilter("active")
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Active
                    </Button>
                    <Button
                        variant={statusFilter === "cancelled" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                            setStatusFilter("cancelled")
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Cancelled
                    </Button>
                </div>

            </CardContent>

            <AddServerDialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    if (!open) {
                        fetchServers()
                    }
                }}
                onCreated={fetchServers}
            />

            <UpdateServerDialog
                key={selectedServer?.id ?? "server-dialog"}
                open={isUpdateDialogOpen}
                onOpenChange={(open) => {
                    setIsUpdateDialogOpen(open)
                    if (!open) {
                        fetchServers()
                    }
                }}
                server={selectedServer}
                onUpdated={fetchServers}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteDialogOpen(false)
                        setServerToDelete(undefined)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the server{" "}
                            <span className="font-semibold text-foreground">{serverToDelete?.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
