"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"

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
}

interface UpdateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task?: Task
    onSuccess?: () => void
}

export function UpdateTaskDialog({ open, onOpenChange, task, onSuccess }: UpdateTaskDialogProps) {
    const [loading, setLoading] = useState(false)
    const [gigType, setGigType] = useState("1")
    const [formData, setFormData] = useState<Partial<Task>>({})

    useEffect(() => {
        if (task && open) {
            setFormData(task)
            setGigType(String(task.gigtype || "1"))
        } else {
            setFormData({})
            setGigType("1")
        }
    }, [task, open])

    const handleChange = (field: keyof Task, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!task) return

        try {
            setLoading(true)
            await api.put(`/campaigns/tasks/${task.id}`, {
                ...formData,
                gigtype: parseInt(gigType),
                subgigtype: parseInt(String(formData.subgigtype || "0")),
                price: parseFloat(String(formData.price || "0"))
            })
            onOpenChange(false)
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Failed to update task:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl top-[5%] !translate-y-0 max-h-[90vh] flex flex-col p-0 gap-0">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <DialogHeader className="py-4 px-6 border-b shrink-0">
                        <DialogTitle className="text-orange-500 text-lg">Update Task</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-6">
                        <div className="space-y-4 py-4">
                            {/* Task Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="task_details">Task Name</Label>
                                <Input
                                    id="task_details"
                                    value={formData.task_details || ""}
                                    onChange={(e) => handleChange("task_details", e.target.value)}
                                    placeholder="Enter task name"
                                />
                            </div>

                            {/* Service Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="price">Service Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price || ""}
                                    onChange={(e) => handleChange("price", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Service URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="source">Service URL</Label>
                                <Input
                                    id="source"
                                    value={formData.source || ""}
                                    onChange={(e) => handleChange("source", e.target.value)}
                                    placeholder="Enter service URL"
                                />
                            </div>

                            {/* Gig Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="gigtitle">Gig Title</Label>
                                <Input
                                    id="gigtitle"
                                    value={formData.gigtitle || ""}
                                    onChange={(e) => handleChange("gigtitle", e.target.value)}
                                    placeholder="Enter gig title"
                                />
                            </div>

                            {/* Gig Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="gigtype">Gig Type</Label>
                                <Select value={gigType} onValueChange={(val) => setGigType(val)}>
                                    <SelectTrigger id="gigtype">
                                        <SelectValue placeholder="Select Gig Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Standard</SelectItem>
                                        <SelectItem value="2">Offpage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Offpage Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="subgigtype">Offpage Type</Label>
                                <Select
                                    value={String(formData.subgigtype || "")}
                                    onValueChange={(val) => handleChange("subgigtype", parseInt(val))}
                                    disabled={gigType !== "2"}
                                >
                                    <SelectTrigger id="subgigtype">
                                        <SelectValue placeholder="Select Offpage Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Social Profiles</SelectItem>
                                        <SelectItem value="2">Foundation Links</SelectItem>
                                        <SelectItem value="3">PBN Links</SelectItem>
                                        <SelectItem value="4">Social Signals</SelectItem>
                                        <SelectItem value="5">Press Release</SelectItem>
                                        <SelectItem value="6">Citations</SelectItem>
                                        <SelectItem value="7">Cloud Stacking</SelectItem>
                                        <SelectItem value="8">Web 2.0 Links</SelectItem>
                                        <SelectItem value="9">Directories</SelectItem>
                                        <SelectItem value="10">Niche Edits</SelectItem>
                                        <SelectItem value="11">Guest Posts</SelectItem>
                                        <SelectItem value="12">Tier 2/3</SelectItem>
                                        <SelectItem value="13">Edu Links</SelectItem>
                                        <SelectItem value="14">News Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Linking To */}
                            <div className="grid gap-2">
                                <Label htmlFor="linkingto">Linking To</Label>
                                <Textarea
                                    id="linkingto"
                                    value={formData.linkingto || ""}
                                    onChange={(e) => handleChange("linkingto", e.target.value)}
                                    className="h-24"
                                    placeholder="Enter linking URLs..."
                                />
                            </div>

                            {/* Anchor Texts */}
                            <div className="grid gap-2">
                                <Label htmlFor="anchortexts">Anchor Texts</Label>
                                <Textarea
                                    id="anchortexts"
                                    value={formData.anchortexts || ""}
                                    onChange={(e) => handleChange("anchortexts", e.target.value)}
                                    className="h-20"
                                    placeholder="Enter anchor texts..."
                                />
                            </div>

                            {/* Campaign URLs */}
                            <div className="grid gap-2">
                                <Label htmlFor="comments">Campaign URLs</Label>
                                <Textarea
                                    id="comments"
                                    value={formData.comments || ""}
                                    onChange={(e) => handleChange("comments", e.target.value)}
                                    className="h-32"
                                    placeholder="Enter campaign URLs..."
                                />
                            </div>

                            {/* Campaign Indexing */}
                            <div className="grid gap-2">
                                <Label htmlFor="indexing">Campaign Indexing</Label>
                                <Select
                                    value={formData.indexing ? "true" : "false"}
                                    onValueChange={(val) => handleChange("indexing", val === "true")}
                                >
                                    <SelectTrigger id="indexing">
                                        <SelectValue placeholder="Select indexing status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">Not Indexed</SelectItem>
                                        <SelectItem value="true">Indexed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Task Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">Task Status</Label>
                                <Select
                                    value={formData.status || "no"}
                                    onValueChange={(val) => handleChange("status", val)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select task status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no">Not Started</SelectItem>
                                        <SelectItem value="yes">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="py-4 px-6 border-t shrink-0">
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                            {loading ? "Updating..." : "Update Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
