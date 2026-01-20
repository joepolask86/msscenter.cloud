"use client"

import { useEffect, useState } from "react"
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
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
import { AddDomainDialog } from "./add-domain-dialog"
import { UpdateDomainDialog } from "./update-domain-dialog"

interface ApiDomain {
    id: number
    name: string
    serverId: number
    serverName?: string | null
    build: number
    quality: number
    type: number
    status?: number
    registrar: string
    registrationDate: string | null
    expiringDate: string | null
    createdAt: string | null
    updatedAt: string | null
}

interface DomainsResponse {
    domains: ApiDomain[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export function DomainsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [domains, setDomains] = useState<ApiDomain[]>([])
    const [selectedDomain, setSelectedDomain] = useState<ApiDomain | undefined>()
    const [totalEntries, setTotalEntries] = useState(0)
    const [loading, setLoading] = useState(false)
    const [qualityFilter, setQualityFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [buildFilter, setBuildFilter] = useState<string | null>("1")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [domainToDelete, setDomainToDelete] = useState<ApiDomain | undefined>()
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                setLoading(true)
                const limit = parseInt(entriesPerPage, 10)
                const params = new URLSearchParams()
                params.set("page", String(currentPage))
                params.set("limit", String(limit))
                if (searchQuery) {
                    params.set("search", searchQuery)
                }
                if (qualityFilter !== null) {
                    params.set("quality", qualityFilter)
                }
                if (statusFilter !== null) {
                    params.set("status", statusFilter)
                }
                if (buildFilter !== null) {
                    params.set("build", buildFilter)
                }

                const response = await api.get<DomainsResponse>(`/domains?${params.toString()}`)
                setDomains(response.domains)
                setTotalEntries(response.total)
            } catch (error) {
                console.error("Failed to fetch domains:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDomains()
    }, [currentPage, entriesPerPage, searchQuery, qualityFilter, statusFilter, buildFilter])

    const handleDomainUpdated = () => {
        const limit = parseInt(entriesPerPage, 10)
        const params = new URLSearchParams()
        params.set("page", String(currentPage))
        params.set("limit", String(limit))
        if (searchQuery) {
            params.set("search", searchQuery)
        }
        if (qualityFilter !== null) {
            params.set("quality", qualityFilter)
        }
        if (statusFilter !== null) {
            params.set("status", statusFilter)
        }
        if (buildFilter !== null) {
            params.set("build", buildFilter)
        }

        api.get<DomainsResponse>(`/domains?${params.toString()}`)
            .then((response) => {
                setDomains(response.domains)
                setTotalEntries(response.total)
            })
            .catch((error) => {
                console.error("Failed to refresh domains:", error)
            })
    }

    const handleDelete = async () => {
        if (!domainToDelete) return
        try {
            setDeleting(true)
            await api.delete(`/domains/${domainToDelete.id}`)
            setDeleteDialogOpen(false)
            setDomainToDelete(undefined)
            handleDomainUpdated()
        } catch (error) {
            console.error("Failed to delete domain:", error)
        } finally {
            setDeleting(false)
        }
    }

    const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / parseInt(entriesPerPage))

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-primary">Domain Manager</CardTitle>
                </div>
                <Button
                    className="btn-primarybg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Add New
                </Button>
            </CardHeader>
            <CardContent>
                {/* Controls Row */}
                <div className="flex items-center justify-between mb-4">
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
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="max-w-xs"
                    />
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Domain Name</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead>Registrar</TableHead>
                                <TableHead>Expiring Date</TableHead>
                                <TableHead className="text-center">Domain Type</TableHead>
                                <TableHead className="text-center">Expiring Status</TableHead>
                                <TableHead className="text-center">Build</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
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
                            ) : domains.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                        No domains found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                domains.map((domain) => (
                                    <TableRow key={domain.id}>
                                        <TableCell className="font-medium">{domain.name}</TableCell>
                                        <TableCell>{domain.serverName}</TableCell>
                                        <TableCell>{domain.registrar}</TableCell>
                                        <TableCell>{domain.expiringDate}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={`${domain.type === 2
                                                    ? "bg-slate-600 hover:bg-slate-700"
                                                    : domain.type === 3
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : "bg-teal-600 hover:bg-teal-700"
                                                    } border-0`}
                                            >
                                                {domain.type === 2
                                                    ? "Freenom"
                                                    : domain.type === 3
                                                        ? "Premium"
                                                        : "Normal"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={`${domain.status === 3
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : domain.status === 2
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-700 hover:bg-green-600"
                                                    } border-0`}
                                            >
                                                {domain.status === 3
                                                    ? "Expired"
                                                    : domain.status === 2
                                                        ? "Expiring"
                                                        : "Active"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={`${domain.build === 2
                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                    : "bg-gray-600 hover:bg-gray-700"
                                                    } border-0`}
                                            >
                                                {domain.build === 2 ? "Build" : "Available"}
                                            </Badge>
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
                                                            setSelectedDomain(domain)
                                                            setIsUpdateDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setDomainToDelete(domain)
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

                {/* Footer and Filters */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {domains.length > 0 ? (currentPage - 1) * parseInt(entriesPerPage, 10) + 1 : 0} to{" "}
                        {Math.min(currentPage * parseInt(entriesPerPage, 10), totalEntries)} of {totalEntries} entries
                    </p>
                    <div className="flex items-center gap-2">
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
                            onClick={() => {
                                const maxPage = Math.ceil(totalEntries / parseInt(entriesPerPage, 10)) || 1
                                setCurrentPage((prev) => Math.min(prev + 1, maxPage))
                            }}
                            disabled={currentPage * parseInt(entriesPerPage, 10) >= totalEntries || loading}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mt-4">
                    <Button
                        className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
                        variant={buildFilter === "2" ? "default" : "outline"}
                        onClick={() => {
                            if (buildFilter === "2") {
                                setBuildFilter(null)
                            } else {
                                setBuildFilter("2")
                                setStatusFilter(null)
                                setQualityFilter(null)
                            }
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Build
                    </Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                        variant={statusFilter === "2" ? "default" : "outline"}
                        onClick={() => {
                            if (statusFilter === "2") {
                                setStatusFilter(null)
                            } else {
                                setStatusFilter("2")
                                setBuildFilter(null)
                                setQualityFilter(null)
                            }
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Expiring
                    </Button>
                    <Button
                        className="bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                        variant={statusFilter === "3" ? "default" : "outline"}
                        onClick={() => {
                            if (statusFilter === "3") {
                                setStatusFilter(null)
                            } else {
                                setStatusFilter("3")
                                setBuildFilter(null)
                                setQualityFilter(null)
                            }
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Expired
                    </Button>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        variant={qualityFilter === "3" ? "default" : "outline"}
                        onClick={() => {
                            if (qualityFilter === "3") {
                                setQualityFilter(null)
                            } else {
                                setQualityFilter("3")
                                setBuildFilter(null)
                                setStatusFilter(null)
                            }
                            setCurrentPage(1)
                        }}
                        disabled={loading}
                    >
                        Spam
                    </Button>
                </div>
            </CardContent>

            {/* Add Domain Dialog */}
            <AddDomainDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdded={handleDomainUpdated}
            />

            {/* Update Domain Dialog */}
            <UpdateDomainDialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
                domain={selectedDomain}
                onUpdated={handleDomainUpdated}
            />
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteDialogOpen(false)
                        setDomainToDelete(undefined)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the domain{" "}
                            <span className="font-semibold text-foreground">{domainToDelete?.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
