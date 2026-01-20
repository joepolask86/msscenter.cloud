"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SquareArrowOutUpRight, Settings, FileText, Pencil, Trash2, Plus, RefreshCw } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api-client"
import { Campaign, Task } from "@/lib/types"
import { format, parseISO, differenceInDays, formatDistanceToNow } from "date-fns"
import { UpdateCampaignDialog } from "./update-campaign-dialog"
import { TaskDialog } from "./task-dialog"
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

interface CampaignDetailsSidebarProps {
    campaignId: string
}

export function CampaignDetailsSidebar({ campaignId }: CampaignDetailsSidebarProps) {
    const router = useRouter()
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState(true)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [refreshingIndex, setRefreshingIndex] = useState(false)


    const [tasks, setTasks] = useState<Task[]>([])
    const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, investment: 0 })
    const [realTime, setRealTime] = useState<{ visits: number, actions: number, visitors: number } | null>(null)

    // Task Management State
    const [newTaskName, setNewTaskName] = useState("")
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
    const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false)


    const fetchCampaign = async () => {
        try {
            setLoading(true)
            const data = await api.get<Campaign>(`/campaigns/${campaignId}`)
            setCampaign(data)

            if (data.status === 1 && (!data.wpNumPosts || data.wpNumPosts === 0)) {
                checkSitemap(data.id)
            }
        } catch (error) {
            console.error("Failed to fetch campaign details:", error)
        } finally {
            setLoading(false)
        }
    }

    const checkSitemap = async (id: number) => {
        try {
            const updated = await api.post<Campaign>(`/campaigns/${id}/check-sitemap`)
            setCampaign(prev => prev ? { ...prev, wpNumPosts: updated.wpNumPosts } : updated)
        } catch (error) {
            console.error("Failed to check sitemap:", error)
        }
    }

    const fetchTasks = async () => {
        try {
            // Fetch active tasks for the list
            const response = await api.get<{ tasks: any[] }>(`/campaigns/${campaignId}/tasks?limit=5&status=no`)
            setTasks(response.tasks)

            // Fetch overall stats
            const stats = await api.get<{ total: number, completed: number, investment: number }>(`/campaigns/${campaignId}/task-stats`)
            setTaskStats({
                total: stats.total,
                completed: stats.completed,
                investment: stats.investment
            })
        } catch (error) {
            console.error("Failed to fetch tasks/stats:", error)
        }
    }

    const fetchRealTime = async () => {
        try {
            const data = await api.get<any>(`/campaigns/${campaignId}/real-time`)
            if (Array.isArray(data) && data.length > 0) {
                setRealTime(data[0])
            }
        } catch (error) {
            console.error("Failed to fetch real-time analytics:", error)
        }
    }

    const handleAddTask = async () => {
        if (!newTaskName.trim()) return
        try {
            await api.post(`/campaigns/${campaignId}/tasks`, {
                task_details: newTaskName,
                price: 0,
                status: 'no'
            })
            setNewTaskName("")
            fetchTasks()
        } catch (error) {
            console.error("Failed to add task:", error)
        }
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setIsTaskDialogOpen(true)
    }

    const handleDeleteTask = async () => {
        if (!taskToDelete) return
        try {
            await api.delete(`/campaigns/tasks/${taskToDelete.id}`)
            setIsDeleteTaskDialogOpen(false)
            setTaskToDelete(null)
            fetchTasks()
        } catch (error) {
            console.error("Failed to delete task:", error)
        }
    }

    useEffect(() => {
        if (campaignId) {
            fetchCampaign()
            fetchTasks()
            fetchRealTime()

            const interval = setInterval(fetchRealTime, 30000)
            return () => clearInterval(interval)
        }
    }, [campaignId])

    const handleRefreshIndex = async () => {
        if (!campaign) return
        try {
            setRefreshingIndex(true)
            await api.post(`/campaigns/${campaign.id}/refresh-index`)
            await fetchCampaign() // Reload to get new dates
        } catch (error) {
            console.error("Failed to refresh index:", error)
        } finally {
            setRefreshingIndex(false)
        }
    }

    const handleDelete = async () => {
        if (!campaign) return
        try {
            await api.delete(`/campaigns/${campaign.id}`)
            router.push('/campaigns')
        } catch (error) {
            console.error("Failed to delete campaign:", error)
        }
    }

    const getDaysUntilExpiration = (dateString?: string) => {
        if (!dateString) return "N/A"
        const today = new Date()
        const expDate = parseISO(dateString)
        const days = differenceInDays(expDate, today)
        return `${days} Day(s)`
    }

    const formatDate = (dateString?: string, formatStr: string = "do MMMM, yyyy") => {
        if (!dateString) return "N/A"
        try {
            return format(parseISO(dateString), formatStr)
        } catch {
            return "Invalid Date"
        }
    }

    if (!campaign && !loading) {
        return <div className="p-4 text-center">Campaign not found</div>
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {/* Current Pages Indexed Skeleton */}
                <Card className="gap-3">
                    <CardHeader><div className="h-5 w-40 bg-muted/50 rounded animate-pulse" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 bg-muted/50 rounded animate-pulse" />
                            <div className="space-y-1">
                                <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
                                <div className="h-6 w-16 bg-muted/50 rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
                {/* Visitors Skeleton */}
                <Card className="gap-3">
                    <CardHeader><div className="h-5 w-40 bg-muted/50 rounded animate-pulse" /></CardHeader>
                    <CardContent className="h-24 bg-muted/50 rounded animate-pulse mx-4 mb-4" />
                </Card>
                {/* Options Skeleton */}
                <Card className="gap-3 pt-0">
                    <CardHeader className="pt-4"><div className="h-5 w-32 bg-muted/50 rounded animate-pulse" /></CardHeader>
                    <CardContent className="space-y-2">
                        <div className="h-8 w-full bg-muted/50 rounded animate-pulse" />
                        <div className="h-8 w-full bg-muted/50 rounded animate-pulse" />
                        <div className="h-8 w-full bg-muted/50 rounded animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!campaign) return null

    return (
        <div className="space-y-4">
            {/* Current Pages Indexed */}
            <Card className="gap-3 group">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-primary">CURRENT PAGES INDEXED</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute -top-10 right-2 h-9 w-9 [&_svg:not([class*='size-'])]:size-8 cursor-pointer text-muted-foreground !bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out ${refreshingIndex ? 'animate-spin opacity-100' : ''}`}
                        onClick={handleRefreshIndex}
                        disabled={refreshingIndex}
                    >
                        <RefreshCw />
                    </Button> */}
                    <div className="flex items-center gap-2">
                        <span className="bg-muted p-3">
                            <FcGoogle className="h-7 w-7" />
                        </span>
                        <div>
                            <span className="text-xs text-muted-foreground block">
                                As of {campaign.gIndexDate ? formatDate(campaign.gIndexDate) : "N/A"}
                            </span>
                            <span className="text-2xl font-bold">{campaign.gIndex || 0}</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        {/* Only show Build No. of Posts if status is Active (1) */}
                        {campaign.status === 1 && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-semibold text-xs">BUILD NO. OF POSTS:</span>
                                <Badge variant="secondary" className="bg-green-700 text-white rounded-sm">
                                    {campaign.wpNumPosts || 0}
                                </Badge>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground font-semibold text-xs">BING INDEXED PAGES:</span>
                            <Badge variant="default" className="bg-yellow-500 text-white rounded-sm">
                                {campaign.bIndex || 0}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground font-semibold text-xs">LAST CHECKED:</span>
                            <span className="text-xs">
                                {campaign.bIndexDate ? formatDate(campaign.bIndexDate) : "N/A"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Real Time Visitors */}
            <Card className="gap-3">
                <CardHeader className="pb-0">
                    <CardTitle className="text-base font-semibold text-primary">REAL TIME VISITORS</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2 py-4 mx-4 border border-accent-200">
                    <div className="text-5xl font-bold bg-muted p-4 rounded-md w-24 mx-auto mb-4">{realTime?.visitors || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{realTime?.visitors || 0} visits</span> and <span className="font-semibold text-foreground">{realTime?.actions || 0} actions</span> in the last <span className="font-semibold text-foreground">10 minutes</span>
                    </p>
                </CardContent>
            </Card>

            {/* Site Options */}
            <Card className="gap-3 pt-0">
                <CardHeader className="border-b border-accent-200 [.border-b]:pb-3 pt-4">
                    <CardTitle className="text-base font-semibold text-primary">SITE OPTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm" asChild>
                        <a href={campaign.fullUrl} target="_blank" rel="noopener noreferrer">
                            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                            Visit Site
                        </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm" asChild>
                        <a href={`${campaign.fullUrl}/wp-admin`} target="_blank" rel="noopener noreferrer">
                            <Settings className="mr-2 h-4 w-4" />
                            WP Admin
                        </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm" asChild>
                        <a href={`${campaign.fullUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            Site Sitemap
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        size="sm"
                        onClick={() => setIsUpdateDialogOpen(true)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Update Campaign
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-red-500 hover:text-red-600"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </CardContent>
            </Card>

            {/* Site Details */}
            <Card className="gap-3 pt-0">
                <CardHeader className="border-b border-accent-200 [.border-b]:pb-3 pt-4">
                    <CardTitle className="text-base font-semibold text-primary">SITE DETAILS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Affiliate Network:</span>
                        <span>{campaign.networkName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Niche:</span>
                        <span>{campaign.nicheName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Target Country:</span>
                        <span>{campaign.country || "US"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracking Number:</span>
                        <span>{campaign.trackNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Indexer Submission:</span>
                        <Badge variant={campaign.indexer ? "default" : "destructive"} className={`text-xs text-white ${campaign.indexer ? "bg-green-700" : ""}`}>
                            {campaign.indexer ? "YES" : "NO"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Server IP:</span>
                        {/* Assuming we might want to fetch Server details fully if needed, currently using name */}
                        <span>{campaign.serverIP || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Server Name:</span>
                        <span>{campaign.serverName || "N/A"}</span>
                    </div>
                    {/* Domain Register info is not in campaign model, skipping/placeholder */}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain Register:</span>
                        <span>N/A</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain Expiring:</span>
                        <span>{formatDate(campaign.domainExpiringDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Days to Expire:</span>
                        <span className={differenceInDays(parseISO(campaign.domainExpiringDate || ''), new Date()) < 30 ? "text-red-500 font-bold" : ""}>
                            {getDaysUntilExpiration(campaign.domainExpiringDate)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Domain Status:</span>
                        <Badge className={`text-xs ${campaign.status === 1 ? "bg-green-700" : "bg-gray-500"}`}>
                            {campaign.status === 1 ? "Active" : campaign.status === 2 ? "Stopped" : "Pending"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date Added:</span>
                        <span>{formatDate(campaign.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Built Duration:</span>
                        <span>{campaign.dateBuilt ? formatDistanceToNow(parseISO(campaign.dateBuilt)) + " ago" : "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Built Status:</span>
                        <Badge className={`text-xs ${campaign.status === 1 ? "bg-green-700" : "bg-gray-500"}`}>
                            {campaign.status === 1 ? "Built" : "Pending"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Google Search Console:</span>
                        <Badge className={`text-xs ${campaign.searchConsole ? "bg-green-700" : "bg-gray-500"}`}>
                            {campaign.searchConsole ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Bing Webmaster:</span>
                        <Badge className={`text-xs ${campaign.bing ? "bg-green-700" : "bg-gray-500"}`}>
                            {campaign.bing ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Powered By:</span>
                        <Badge variant="secondary" className="bg-gray-700 text-white text-xs">
                            {campaign.mssType === 2 ? "Manual" : "Page Generator Pro"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Activity/Expenses Tracking - Keeping UI but using dynamic ID link */}
            <Card className="gap-3 pt-0">
                <CardHeader className="border-b border-accent-200 [.border-b]:pb-3 pt-4">
                    <CardTitle className="text-base font-medium text-primary">Activity/Expenses Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter service name..."
                            className="text-sm"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTask()
                            }}
                        />
                        <Button
                            size="icon"
                            className="bg-green-600 hover:bg-green-700 shrink-0 cursor-pointer"
                            onClick={handleAddTask}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Table className="border">
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>Service Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-12 text-muted-foreground text-xs">
                                        No tasks recorded
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="text-xs max-w-[150px] py-1.5" title={task.task_details}>
                                            <div className="truncate">{task.task_details || "Unnamed Service"}</div>
                                            <div className="text-[10px] text-muted-foreground pt-0.5">
                                                {task.created_at ? formatDate(task.created_at, "MMM d, yyyy") : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs py-1.5">${task.price || 0}</TableCell>
                                        <TableCell className="flex gap-0 justify-end py-1.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleEditTask(task)}
                                            >
                                                <Pencil className="h-2 w-2" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-500"
                                                onClick={() => {
                                                    setTaskToDelete(task)
                                                    setIsDeleteTaskDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-2 w-2" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <Link href={`/campaigns/taskdetails/${campaignId}`}>
                        <Button variant="default" className="w-32 text-xs cursor-pointer">
                            Task Details
                        </Button>
                    </Link>

                    <div className="bg-green-100 dark:bg-green-800/20 p-3 rounded-md space-y-1 text-sm text-muted-foreground mt-4">
                        <div className="flex justify-between">
                            <span>{taskStats.total} Task added</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{taskStats.completed} Task completed</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>${taskStats.investment.toFixed(2)} Total Investment</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <UpdateCampaignDialog
                open={isUpdateDialogOpen}
                onOpenChange={(open) => {
                    setIsUpdateDialogOpen(open)
                    if (!open) fetchCampaign()
                }}
                campaign={campaign}
            />

            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                task={editingTask}
                onSave={fetchTasks}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the campaign <span className="font-semibold text-foreground">{campaign.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isDeleteTaskDialogOpen} onOpenChange={setIsDeleteTaskDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteTask}>
                            Delete Task
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
