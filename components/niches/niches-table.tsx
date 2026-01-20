 "use client"

 import { cn } from "@/lib/utils"

 import { useEffect, useState } from "react"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
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
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
 } from "@/components/ui/alert-dialog"
 import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
 } from "@/components/ui/select"
 import { Pencil, MoreVertical, Trash2, Grid3x3 } from "lucide-react"
 import { AddNicheDialog } from "./add-niche-dialog"
 import { UpdateNicheDialog } from "./update-niche-dialog"
 import { api } from "@/lib/api-client"
 import { Skeleton } from "@/components/ui/skeleton"
 import { Niche as BaseNiche } from "@/lib/types"
 import { format } from "date-fns"

 interface ApiNiche extends BaseNiche {
     elocalName?: string
     phoneNumber?: string
     categoryId?: string | number
     description?: string
     createdAt?: string
 }

 interface NichesResponse {
     niches: ApiNiche[];
     total: number;
     page: number;
     pages: number;
     hasNext: boolean;
     hasPrev: boolean;
 }

 export function NichesTable() {
     const [niches, setNiches] = useState<ApiNiche[]>([])
     const [loading, setLoading] = useState(true)
     const [searchQuery, setSearchQuery] = useState("")
     const [entriesPerPage, setEntriesPerPage] = useState("10")
     const [currentPage, setCurrentPage] = useState(1)
     const [totalEntries, setTotalEntries] = useState(0)
     const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
     const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
     const [selectedNiche, setSelectedNiche] = useState<ApiNiche | undefined>()
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const [nicheToDelete, setNicheToDelete] = useState<ApiNiche | undefined>()

     const fetchNiches = async () => {
         try {
             setLoading(true)
             const response = await api.get<NichesResponse>(
                 `/niches?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}`
             )
             setNiches(response.niches)
             setTotalEntries(response.total)
         } catch (error) {
             console.error("Failed to fetch niches:", error)
         } finally {
             setLoading(false)
         }
     }

     useEffect(() => {
         fetchNiches()
     }, [currentPage, entriesPerPage, searchQuery])

     const filteredNiches = niches.filter((niche) =>
         niche.name.toLowerCase().includes(searchQuery.toLowerCase())
     )

     const formatCreatedAt = (dateString?: string) => {
         if (!dateString) return "-"
         const date = new Date(dateString)
         if (isNaN(date.getTime())) return "-"
         return format(date, "do MMMM, yyyy")
     }

     const handleDelete = async () => {
         if (!nicheToDelete) return
         try {
             await api.delete(`/niches/${nicheToDelete.id}`)
             setDeleteDialogOpen(false)
             setNicheToDelete(undefined)
             fetchNiches()
         } catch (error) {
             console.error("Failed to delete niche:", error)
         }
     }

     const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / parseInt(entriesPerPage))

     return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-primary">Niche Manager</CardTitle>
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

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Niche Name</TableHead>
                                <TableHead>eLocal Name</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Category ID</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date Added</TableHead>
                                <TableHead className="text-center">Status</TableHead>
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
                            ) : filteredNiches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                        No niches found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNiches.map((niche) => (
                                    <TableRow key={niche.id}>
                                        <TableCell className="font-medium">{niche.name}</TableCell>
                                        <TableCell>{niche.elocalName || "-"}</TableCell>
                                        <TableCell>{niche.phoneNumber || "-"}</TableCell>
                                        <TableCell>{niche.categoryId ?? "-"}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {niche.description || "-"}
                                        </TableCell>
                                        <TableCell>{formatCreatedAt(niche.createdAt)}</TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={cn(
                                                    "text-white px-3 py-1 rounded text-xs font-bold rounded-full",
                                                    niche.status ? "bg-green-700" : "bg-red-600"
                                                )}
                                            >
                                                {niche.status ? "Active" : "Disabled"}
                                            </span>
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
                                                            setSelectedNiche(niche)
                                                            setIsUpdateDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setNicheToDelete(niche)
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

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * parseInt(entriesPerPage) + (filteredNiches.length > 0 ? 1 : 0)} to{" "}
                        {Math.min(currentPage * parseInt(entriesPerPage), totalEntries)} of {totalEntries} entries
                    </p>
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
            </CardContent>

            {/* Add Niche Dialog */}
            <AddNicheDialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    if (!open) {
                        fetchNiches()
                    }
                }}
                onCreated={fetchNiches}
            />

            {/* Update Niche Dialog */}
            <UpdateNicheDialog
                key={selectedNiche?.id ?? "niche-dialog"}
                open={isUpdateDialogOpen}
                onOpenChange={(open) => {
                    setIsUpdateDialogOpen(open)
                    if (!open) {
                        fetchNiches()
                    }
                }}
                niche={selectedNiche}
                onUpdated={fetchNiches}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteDialogOpen(false)
                        setNicheToDelete(undefined)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the niche{" "}
                            <span className="font-semibold text-foreground">{nicheToDelete?.name}</span>.
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
