"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, SquarePen } from "lucide-react"
import { UpdateTaskDialog } from "./update-task-dialog"
import { api } from "@/lib/api-client"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface Task {
    id: number
    campaignId: number
    task_details: string
    price: number | null
    source: string
    gigtitle: string
    gigtype: number
    subgigtype: number
    linkingto: string
    anchortexts: string
    comments: string
    indexing: boolean
    status: string
    created_at: string
}

interface TaskDetailsContentProps {
    campaignId: string
}

export function TaskDetailsContent({ campaignId }: TaskDetailsContentProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | undefined>()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({ total: 0, pages: 1 })

    const fetchTasks = async (page: number) => {
        try {
            setLoading(true)
            const res = await api.get<{ tasks: Task[], total: number, pages: number }>(`/campaigns/${campaignId}/tasks?page=${page}&limit=10`)
            setTasks(res.tasks)
            setPagination({ total: res.total, pages: res.pages })
            setCurrentPage(page)
        } catch (err) {
            console.error("Failed to fetch tasks:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (campaignId) fetchTasks(1)
    }, [campaignId])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchTasks(newPage)
        }
    }

    const getGigTypeBadge = (type: number) => {
        if (type === 2) return { label: "Offpage", color: "bg-red-500" }
        return { label: "Standard", color: "bg-blue-500" }
    }

    const getStatusBadge = (status: string) => {
        if (status === 'yes') return { label: "Completed", color: "bg-green-500" }
        return { label: "Not Started", color: "bg-gray-500" }
    }

    const formatDateBadge = (dateStr: string) => {
        if (!dateStr) return { month: 'N/A', day: '' }
        try {
            const date = new Date(dateStr)
            return {
                month: format(date, 'MMM').toUpperCase(),
                day: format(date, 'd')
            }
        } catch {
            return { month: 'N/A', day: '' }
        }
    }

    const formatDateFull = (dateStr: string) => {
        if (!dateStr) return 'N/A'
        try {
            return format(new Date(dateStr), 'do MMMM, yyyy')
        } catch {
            return 'N/A'
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        {/* Date Badge Skeleton */}
                        <div className="shrink-0">
                            <Skeleton className="h-[60px] w-16 rounded-md" />
                        </div>

                        {/* Task Card Skeleton */}
                        <Card className="flex-1">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <Skeleton className="h-6 w-48" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <Skeleton className="h-10 w-full mb-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Task Cards */}
            <div className="space-y-6">
                {tasks.map((task) => {
                    const dateBadge = formatDateBadge(task.created_at)
                    const gigBadge = getGigTypeBadge(task.gigtype)
                    const statusBadge = getStatusBadge(task.status)

                    return (
                        <div key={task.id} className="flex gap-4">
                            {/* Date Badge */}
                            <div className="shrink-0">
                                <div className="bg-slate-500 text-white text-center rounded-md p-3 w-16">
                                    <div className="text-xs font-semibold">{dateBadge.month} {dateBadge.day}</div>
                                </div>
                            </div>

                            {/* Task Card */}
                            <Card className="flex-1">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold">
                                            {task.gigtitle || "Untitled Task"}
                                            <button
                                                onClick={() => {
                                                    setSelectedTask(task)
                                                    setIsUpdateDialogOpen(true)
                                                }}
                                                className="ml-2 hover:text-primary transition-colors"
                                            >
                                                <SquarePen className="h-4 w-4 inline" />
                                            </button>
                                        </h3>
                                        <div className="flex gap-2">
                                            <Badge className={`${gigBadge.color} text-white hover:opacity-90`}>
                                                {gigBadge.label}
                                            </Badge>
                                            <Badge className={`${statusBadge.color} text-white hover:opacity-90`}>
                                                {statusBadge.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <Tabs defaultValue="task-info" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="task-info">Task Information</TabsTrigger>
                                            <TabsTrigger value="linking-to">Linking To</TabsTrigger>
                                            <TabsTrigger value="anchor-text">Anchor Text</TabsTrigger>
                                            <TabsTrigger value="campaign-urls">Campaign URLs</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="task-info" className="space-y-3 mt-4">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground font-medium">Service Price:</span>
                                                    <p className="mt-1">${Number(task.price || 0).toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground font-medium">Service URL:</span>
                                                    <p className="mt-1 truncate max-w-[200px]">{task.source || "N/A"}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground font-medium">Task Date:</span>
                                                    <p className="mt-1">{formatDateFull(task.created_at)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground font-medium">Campaign Indexing:</span>
                                                    <div className="mt-1">
                                                        <Badge variant="secondary" className={`${task.indexing ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                                                            {task.indexing ? "Indexed" : "Not Indexed"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="linking-to">
                                            <p className="text-sm text-muted-foreground py-4 whitespace-pre-wrap">{task.linkingto || "No linking information available"}</p>
                                        </TabsContent>

                                        <TabsContent value="anchor-text">
                                            <p className="text-sm text-muted-foreground py-4 whitespace-pre-wrap">{task.anchortexts || "No anchor text information available"}</p>
                                        </TabsContent>

                                        <TabsContent value="campaign-urls">
                                            <p className="text-sm text-muted-foreground py-4 whitespace-pre-wrap">{task.comments || "No campaign URLs available"}</p>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}

                {tasks.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">No tasks found.</div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-between items-center pt-4 md:ml-20">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {currentPage} of {pagination.pages}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pagination.pages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Update Task Dialog */}
            <UpdateTaskDialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
                task={selectedTask}
                onSuccess={() => fetchTasks(currentPage)}
            />
        </div>
    )
}
