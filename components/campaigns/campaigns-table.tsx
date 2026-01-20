"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Eye, Pencil, MoreVertical, Trash2, Link as LinkIcon, Grid3x3, CircleStop, PlayCircle } from "lucide-react"
import { AddCampaignDialog } from "./add-campaign-dialog"
import { UpdateCampaignDialog } from "./update-campaign-dialog"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { differenceInDays, parseISO } from "date-fns"
import { Campaign } from "@/lib/types"
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

interface CampaignsResponse {
    campaigns: Campaign[];
    total: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

const getStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return <Badge className="bg-green-700 hover:bg-green-600">Active</Badge>;
        case 2:
            return <Badge variant="destructive">Stopped</Badge>;
        case 3:
            return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};

const getMssTypeLabel = (type: number) => {
    if (type === 2) return "Manual";
    return "PGP";
};

export function CampaignsTable() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)

    // Status Filter: 1=Active (default), 2=Stopped, 3=Pending
    const [statusFilter, setStatusFilter] = useState(1)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>()

    // State for confirmation dialog
    const [actionDialogState, setActionDialogState] = useState<{
        open: boolean;
        type: 'start' | 'stop' | 'delete';
        campaign?: Campaign;
    }>({
        open: false,
        type: 'start'
    })

    const debouncedSearch = useDebounce(searchQuery, 500)

    const fetchCampaigns = async () => {
        try {
            setLoading(true)
            const response = await api.get<CampaignsResponse>(
                `/campaigns?page=${currentPage}&limit=${entriesPerPage}&search=${debouncedSearch}&status=${statusFilter}`
            )
            setCampaigns(response.campaigns)
            setTotalEntries(response.total)
        } catch (error) {
            console.error("Failed to fetch campaigns:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async () => {
        if (!actionDialogState.campaign) return

        try {
            if (actionDialogState.type === 'delete') {
                await api.delete(`/campaigns/${actionDialogState.campaign.id}`)
            } else {
                const newStatus = actionDialogState.type === 'start' ? 1 : 2 // 1=Active, 2=Stopped
                await api.put(`/campaigns/${actionDialogState.campaign.id}`, { status: newStatus })
            }
            fetchCampaigns()
            setActionDialogState(prev => ({ ...prev, open: false }))
        } catch (error) {
            console.error(`Failed to ${actionDialogState.type} campaign:`, error)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [currentPage, entriesPerPage, debouncedSearch, statusFilter])

    // handleDelete function replaced by dialog action

    const formatRelativeTime = (dateString?: string) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffSeconds = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000))

            if (diffSeconds < 60) {
                return `${diffSeconds} sec ago`
            }

            const diffMinutes = Math.round(diffSeconds / 60)
            if (diffMinutes < 60) {
                return `${diffMinutes} min ago`
            }

            const diffHours = Math.round(diffMinutes / 60)
            if (diffHours < 24) {
                return `${diffHours} hr${diffHours !== 1 ? "s" : ""} ago`
            }

            const diffDays = Math.round(diffHours / 24)
            if (diffDays < 30) {
                return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
            }

            const diffMonths = Math.round(diffDays / 30)
            if (diffMonths < 12) {
                return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
            }

            const diffYears = Math.round(diffMonths / 12)
            return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`
        } catch {
            return "Invalid Date"
        }
    }

    const getDaysUntilExpiration = (dateString?: string) => {
        if (!dateString) return ""

        const today = new Date()
        const expDate = parseISO(dateString)
        const days = differenceInDays(expDate, today)

        if (days < 0) return <span className="text-red-500 font-bold">Expired</span>
        if (days <= 30) return <span className="text-red-500 font-medium">{days} days</span>
        if (days <= 60) return <span className="text-orange-500">{days} days</span>

        return <span className="text-green-600">{days} days</span>
    }

    // Helper to get action text for dialog
    const getActionText = () => {
        switch (actionDialogState.type) {
            case 'start': return 'start';
            case 'stop': return 'permanently stop';
            case 'delete': return 'delete';
            default: return '';
        }
    }

    const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / parseInt(entriesPerPage))

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-primary">Campaigns</CardTitle>
                </div>
                <Button
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Add New
                </Button>
            </CardHeader>
            <CardContent>
                {/* Controls Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Select value={entriesPerPage} onValueChange={(val) => {
                            setEntriesPerPage(val)
                            setCurrentPage(1)
                        }}>
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

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Campaign Name</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead>Niche</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Index</TableHead>
                                <TableHead className="text-center">Type</TableHead>
                                <TableHead className="text-center">Durations</TableHead>
                                <TableHead className="text-center">Expires</TableHead>
                                <TableHead className="text-right pr-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(11)].map((_, j) => (
                                            <TableCell key={j} className="h-10">
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : campaigns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center h-24 text-muted-foreground">
                                        No campaigns found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/campaigns/${campaign.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {campaign.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                <a href={campaign.fullUrl || campaign.url} target="_blank" rel="noopener noreferrer">
                                                    <LinkIcon className="h-4 w-4 text-primary" />
                                                </a>
                                            </Button>
                                        </TableCell>
                                        <TableCell>{campaign.networkName || ''}</TableCell>
                                        <TableCell>{campaign.serverName || ''}</TableCell>
                                        <TableCell>{campaign.nicheName || ''}</TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(campaign.status)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={campaign.indexer ? "default" : "destructive"}
                                                className={campaign.indexer ? "bg-green-700 hover:bg-green-600" : ""}
                                            >
                                                {campaign.indexer ? "Yes" : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-gray-700 text-white hover:bg-gray-800">
                                                {getMssTypeLabel(campaign.mssType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">{formatRelativeTime(campaign.dateBuilt)}</TableCell>
                                        <TableCell className="text-center">
                                            {getDaysUntilExpiration(campaign.domainExpiringDate)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/campaigns/${campaign.id}`}>
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedCampaign(campaign)
                                                            setIsUpdateDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {statusFilter === 1 && (
                                                        <DropdownMenuItem
                                                            onClick={() => setActionDialogState({
                                                                open: true,
                                                                type: 'stop',
                                                                campaign
                                                            })}
                                                        >
                                                            <CircleStop className="mr-2 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Stop</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    {statusFilter === 3 && (
                                                        <DropdownMenuItem
                                                            onClick={() => setActionDialogState({
                                                                open: true,
                                                                type: 'start',
                                                                campaign
                                                            })}
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                                            <span className="text-green-600">Start</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => setActionDialogState({
                                                        open: true,
                                                        type: 'delete',
                                                        campaign
                                                    })}>
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

                {/* Footer / Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * parseInt(entriesPerPage) + 1} to {Math.min(currentPage * parseInt(entriesPerPage), totalEntries)} of {totalEntries} entries
                    </p>
                    <div className="flex gap-2">
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage * parseInt(entriesPerPage) >= totalEntries || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button
                        variant={statusFilter === 1 ? "default" : "outline"}
                        className={statusFilter === 1 ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "cursor-pointer"}
                        onClick={() => {
                            setStatusFilter(1)
                            setCurrentPage(1)
                        }}
                    >
                        Active Sites
                    </Button>
                    <Button
                        variant={statusFilter === 3 ? "default" : "outline"}
                        className={statusFilter === 3 ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" : "text-orange-500 border-orange-500 hover:bg-orange-50 cursor-pointer"}
                        onClick={() => {
                            setStatusFilter(3)
                            setCurrentPage(1)
                        }}
                    >
                        Pending Sites
                    </Button>
                    <Button
                        variant={statusFilter === 2 ? "default" : "outline"}
                        className={statusFilter === 2 ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "text-red-500 border-red-500 hover:bg-red-50 cursor-pointer"}
                        onClick={() => {
                            setStatusFilter(2)
                            setCurrentPage(1)
                        }}
                    >
                        Stopped Sites
                    </Button>
                </div>
            </CardContent>

            {/* Add Campaign Dialog */}
            <AddCampaignDialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    if (!open) fetchCampaigns() // Refresh on close if added
                }}
            />

            {/* Update Campaign Dialog */}
            {selectedCampaign && (
                <UpdateCampaignDialog
                    open={isUpdateDialogOpen}
                    onOpenChange={(open) => {
                        setIsUpdateDialogOpen(open)
                        if (!open) fetchCampaigns()
                    }}
                    campaign={selectedCampaign}
                />
            )}

            {/* Action Confirmation Dialog */}
            <AlertDialog open={actionDialogState.open} onOpenChange={(open) => !open && setActionDialogState(prev => ({ ...prev, open: false }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will {getActionText()} the campaign <span className="font-semibold text-foreground">{actionDialogState.campaign?.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className={actionDialogState.type === 'start' ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}
                            onClick={handleAction}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
